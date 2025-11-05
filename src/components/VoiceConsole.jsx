import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Zap, Cpu, AlertCircle, ShieldCheck } from 'lucide-react';

const getSpeechRecognition = () => {
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  return SR ? new SR() : null;
};

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

const VoiceConsole = () => {
  const [supported, setSupported] = useState(true);
  const [secure, setSecure] = useState(true);
  const [permission, setPermission] = useState('unknown'); // unknown | granted | denied
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check secure context - many browsers require HTTPS for mic
    const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.protocol === 'https:');
    setSecure(!!isSecure);

    const rec = getSpeechRecognition();
    if (!rec) {
      setSupported(false);
      return;
    }

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setListening(true);
      setError('');
    };

    rec.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript;
        if (res.isFinal) final += text + ' ';
        else final += text;
      }
      setTranscript(final.trim());
    };

    rec.onerror = (e) => {
      let msg = e.error || 'Unknown error';
      if (msg === 'not-allowed' || msg === 'service-not-allowed') {
        msg = 'Microphone permission was denied. Please allow mic access in your browser settings and reload.';
        setPermission('denied');
      } else if (msg === 'no-speech') {
        msg = 'No speech detected. Try speaking closer to the mic.';
      } else if (msg === 'audio-capture') {
        msg = 'No microphone found. Plug in a mic or check device settings.';
      }
      setError(msg);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
      if (transcript) handleGenerateResponse(transcript);
    };

    recognitionRef.current = rec;
  }, [transcript]);

  const requestMic = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop tracks; we just needed the permission prompt.
      stream.getTracks().forEach(t => t.stop());
      setPermission('granted');
      return true;
    } catch (e) {
      setPermission('denied');
      setError('Microphone permission is required. Please allow access and try again.');
      return false;
    }
  };

  const handleStart = async () => {
    setResponse('');
    setTranscript('');
    setError('');

    if (!secure) {
      setError('Microphone requires a secure context (HTTPS). Please open this site via HTTPS.');
      return;
    }

    if (!recognitionRef.current) {
      setSupported(false);
      return;
    }

    if (permission !== 'granted') {
      const ok = await requestMic();
      if (!ok) return;
    }

    try {
      recognitionRef.current.abort?.();
    } catch (_) { /* noop */ }

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Some engines throw if already started
      try { recognitionRef.current.stop(); } catch (_) {}
      setTimeout(() => {
        try { recognitionRef.current.start(); } catch (_) {}
      }, 200);
    }
  };

  const handleStop = () => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch (_) {}
  };

  const speak = (text) => {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 1.05;
    utter.volume = 1;
    const voices = synth.getVoices();
    const voice = voices.find(v => /en-US|en_GB/i.test(v.lang)) || voices[0];
    if (voice) utter.voice = voice;
    synth.cancel();
    synth.speak(utter);
  };

  const handleGenerateResponse = (text) => {
    setThinking(true);
    const t = text.toLowerCase();
    let reply = 'I heard you.';

    if (t.includes('time')) {
      reply = `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (t.includes('date') || t.includes('day')) {
      reply = `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
    } else if (t.includes('joke')) {
      reply = "Here's one: Why do programmers prefer dark mode? Because light attracts bugs.";
    } else if (t.includes('weather')) {
      reply = "I can't access live weather in this demo, but I can tell you it's a great day to build.";
    } else if (t.includes('hello') || t.includes('hey') || t.includes('hi')) {
      reply = 'Hello! How can I assist you today?';
    } else if (t.includes('who are you')) {
      reply = 'I am your futuristic voice agent — think Jarvis, with a calm aura.';
    } else if (t.includes('open') && t.includes('settings')) {
      reply = 'Opening settings... just imagine a sleek panel sliding in.';
    } else if (t) {
      reply = `You said: ${text}`;
    }

    setTimeout(() => {
      setThinking(false);
      setResponse(reply);
      speak(reply);
    }, 700);
  };

  return (
    <section id="voice" className="relative w-full bg-[#0B0B12] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20 ring-1 ring-violet-400/30">
            <Cpu className="h-4 w-4 text-violet-300" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Voice Console</h2>
        </div>

        {!supported ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
            Your browser does not support the Web Speech API. Try the latest Chrome or Edge.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 backdrop-blur md:col-span-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Transcript</p>
                <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ${listening ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-white/5 text-white/60 ring-1 ring-white/10'}`}>
                  <span className={`h-2 w-2 rounded-full ${listening ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                  {listening ? 'Listening' : 'Idle'}
                </span>
              </div>

              {!secure && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  Microphone requires HTTPS. Open this page over https:// and try again.
                </div>
              )}

              {permission === 'denied' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-rose-200">
                  <AlertCircle className="h-4 w-4" />
                  Mic permission denied. Enable microphone access in your browser site settings.
                </div>
              )}

              {error && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-rose-200">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="mt-3 min-h-[140px] rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-sm text-white/80">
                {transcript || 'Tap the mic and start speaking...'}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!listening ? (
                  <button onClick={handleStart} className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110 disabled:opacity-50" disabled={!secure}>
                    <Mic className="h-4 w-4" /> Start Listening
                  </button>
                ) : (
                  <button onClick={handleStop} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15">
                    <MicOff className="h-4 w-4" /> Stop
                  </button>
                )}

                <button onClick={() => transcript && handleGenerateResponse(transcript)} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-40" disabled={!transcript || listening}>
                  <Zap className="h-4 w-4" /> Analyze
                </button>

                <button onClick={requestMic} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10">
                  <ShieldCheck className="h-4 w-4" /> Check mic access
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 backdrop-blur"
            >
              <div>
                <p className="text-sm text-white/60">Assistant</p>
                <div className="mt-3 min-h-[140px] space-y-3">
                  <AnimatePresence mode="wait">
                    {thinking ? (
                      <motion.div
                        key="thinking"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-3 rounded-lg border border-violet-400/20 bg-violet-500/10 p-3 text-violet-200"
                      >
                        <div className="flex -space-x-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:100ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:200ms]" />
                        </div>
                        Thinking...
                      </motion.div>
                    ) : response ? (
                      <motion.div
                        key="response"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-200"
                      >
                        {response}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-lg border border-white/10 bg-black/20 p-3 text-white/60"
                      >
                        Your assistant will reply here.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-white/50">Speech & audio run on your device.</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  <Volume2 className="h-3.5 w-3.5" /> Auto voice reply
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VoiceConsole;

import React from 'react';
import Hero from './components/Hero';
import VoiceConsole from './components/VoiceConsole';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B12] text-white antialiased">
      <Hero />
      <VoiceConsole />
      <Features />
      <Footer />
    </div>
  );
}

export default App;

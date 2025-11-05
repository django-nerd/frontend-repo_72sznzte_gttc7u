import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0B0B12] py-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-white/60">© {new Date().getFullYear()} Jarvis Voice. All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#voice" className="hover:text-white">Voice Console</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

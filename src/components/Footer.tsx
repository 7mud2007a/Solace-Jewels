import React from 'react';
import { SITE_CONFIG } from '../config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 md:px-12 bg-[#04140D] border-t border-[#0B2B1B] text-[#F5EBE1]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Wordmark */}
        <div className="text-center md:text-left">
          <a
            href="#"
            className="font-serif-luxury text-2xl tracking-wider text-[#F5EBE1] hover:text-[#E3C27E] transition-colors"
          >
            {SITE_CONFIG.wordmark}
          </a>
          <p className="font-sans-luxury text-[11px] text-[#E3C27E]/70 uppercase tracking-widest mt-1">
            High Jewelry & Fine Metals
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 text-xs font-sans-luxury tracking-widest text-[#E3C27E]">
          <a href="#" className="hover:text-[#F5EBE1] transition-colors">
            HOME
          </a>
          <a href="#products-section" className="hover:text-[#F5EBE1] transition-colors">
            COLLECTIONS
          </a>
          <a href="#gold-prices" className="hover:text-[#F5EBE1] transition-colors">
            GOLD MARKET
          </a>
          <a href="#contact-section" className="hover:text-[#F5EBE1] transition-colors">
            CONTACT
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-center md:text-right font-sans-luxury text-[11px] text-[#E3C27E]/60 uppercase tracking-wider">
          © {SITE_CONFIG.copyrightYear} {SITE_CONFIG.wordmark.toUpperCase()}. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

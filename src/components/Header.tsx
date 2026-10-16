import React, { useState } from 'react';
import { Menu, X, Compass, Gem } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-8 pb-4 px-6 md:px-12 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        {/* Brand Wordmark matching reference image */}
        <a
          href="#"
          className="font-serif-luxury text-3xl sm:text-4xl tracking-wider text-[#F5EBE1] hover:text-[#E3C27E] transition-colors duration-300 mb-6 text-center"
        >
          {SITE_CONFIG.wordmark}
        </a>

        {/* Desktop Navigation Links matching reference image */}
        <nav className="hidden sm:flex items-center space-x-12 sm:space-x-16 text-[#F5EBE1]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4 mb-1 text-[#E3C27E] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-sans-luxury text-[10px] sm:text-xs tracking-[0.25em] font-light uppercase text-[#E3C27E] group-hover:text-[#F5EBE1] transition-colors duration-300">
              MENU
            </span>
          </button>

          <a
            href="#products-section"
            className="flex flex-col items-center group focus:outline-none"
          >
            <Compass className="w-4 h-4 mb-1 text-[#E3C27E] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-sans-luxury text-[10px] sm:text-xs tracking-[0.25em] font-light uppercase text-[#E3C27E] group-hover:text-[#F5EBE1] transition-colors duration-300">
              DISCOVER
            </span>
          </a>

          <a
            href="#gold-prices"
            className="flex flex-col items-center group focus:outline-none"
          >
            <Gem className="w-4 h-4 mb-1 text-[#E3C27E] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-sans-luxury text-[10px] sm:text-xs tracking-[0.25em] font-light uppercase text-[#E3C27E] group-hover:text-[#F5EBE1] transition-colors duration-300">
              ATELIER
            </span>
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <div className="sm:hidden flex items-center justify-between w-full mt-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#E3C27E] p-2 focus:outline-none"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-sans-luxury text-xs tracking-[0.2em] text-[#E3C27E]">ATELIER</span>
        </div>
      </div>

      {/* Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#061D12]/95 backdrop-blur-md flex flex-col justify-between p-8 text-center animate-fadeIn">
          <div className="flex justify-end">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E3C27E] p-2 hover:text-[#F5EBE1] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-8 my-auto">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-3xl text-[#F5EBE1] hover:text-[#E3C27E] transition-colors"
            >
              Home
            </a>
            <a
              href="#products-section"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-3xl text-[#F5EBE1] hover:text-[#E3C27E] transition-colors"
            >
              Collections
            </a>
            <a
              href="#gold-prices"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-3xl text-[#F5EBE1] hover:text-[#E3C27E] transition-colors"
            >
              Gold Market Prices
            </a>
            <a
              href="#contact-section"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif-luxury text-3xl text-[#F5EBE1] hover:text-[#E3C27E] transition-colors"
            >
              Private Consultation
            </a>
          </div>

          <p className="font-sans-luxury text-xs tracking-[0.2em] text-[#E3C27E]/60 uppercase">
            Solace Jewels High Jewelry
          </p>
        </div>
      )}
    </header>
  );
};

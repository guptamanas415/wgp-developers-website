/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Our Services' },
    { id: 'projects', label: 'Our Projects' },
    { id: 'technologies', label: 'Technologies' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070B]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark & Official Logo */}
          <div
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            aria-label="WGP Developer's Home"
          >
            <Logo size="md" />
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Text Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`whitespace-nowrap transition-colors relative py-1 hover:text-white cursor-pointer ${
                  activeSection === item.id ? 'text-[#00E5FF] font-semibold' : ''
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E5FF] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleLinkClick('order')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#0099FF] hover:from-[#0052CC] hover:to-[#0088FF] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>Place an Order</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-[#0066FF]/20 text-[#00E5FF]'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-800">
                <button
                  onClick={() => handleLinkClick('order')}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#0099FF] text-white text-center text-sm font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(0,102,255,0.3)] cursor-pointer"
                >
                  Place an Order Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

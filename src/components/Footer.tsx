/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Logo } from './Logo';
import { Mail, Globe, ArrowUp } from 'lucide-react';
import { OFFICIAL_BUSINESS_EMAIL, COMPANY_TAGLINE } from '../utils/emailTemplate';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040609] border-t border-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              Official website for WGP Developer's. High-performance web applications, enterprise AI systems, and mobile software.
            </p>
            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              {COMPANY_TAGLINE}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home (3D Experience)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('technologies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Technologies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('order')}
                  className="text-[#00E5FF] hover:underline cursor-pointer font-medium"
                >
                  Place an Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Channel */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Official Channel
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${OFFICIAL_BUSINESS_EMAIL}`}
                  className="hover:text-[#00E5FF] transition-colors break-all"
                >
                  {OFFICIAL_BUSINESS_EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Web Browser Accessible Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} WGP Developer's. All rights reserved. Build • Innovate • Grow.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

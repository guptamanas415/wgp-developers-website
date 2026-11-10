/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To engineer dependable, cutting-edge software products and digital solutions that empower businesses to innovate rapidly, scale seamlessly, and conquer modern technical frontiers.',
    },
    {
      icon: Compass,
      title: 'Our Vision',
      description:
        'To stand as a distinguished software development powerhouse, recognized for architectural precision, creative 3D web mastery, and high-integrity client partnerships globally.',
    },
    {
      icon: Sparkles,
      title: 'Our Approach',
      description:
        'We blend rigorous engineering principles with interactive 3D aesthetics. Every project begins with a clear architectural roadmap, clean modular code, and comprehensive validation before deployment.',
    },
  ];

  const advantages = [
    {
      title: 'Direct Senior Engineering',
      desc: 'Work directly with dedicated software engineers and architects without communication layers or bureaucratic delays.',
    },
    {
      title: 'Advanced 3D & WebGL Capabilities',
      desc: 'Seamlessly integrate real-time Three.js graphics and interactive experiences that captivate users while remaining ultra-lightweight.',
    },
    {
      title: 'Full-Stack Ecosystem Mastery',
      desc: 'From cloud databases and automated AI workflows to native Android and responsive web frontends, we deliver complete solutions.',
    },
    {
      title: 'Zero Technical Debt Architecture',
      desc: 'Clean, type-safe codebases designed for maintainability, high performance, and rapid future feature expansion.',
    },
  ];

  return (
    <section id="about" className="relative py-28 bg-[#05070B] overflow-hidden">
      {/* Decorative hairline grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
            <span>Company Profile</span>
            <span aria-hidden="true">·</span>
            <span>Software Development Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            About WGP <span className="text-[#00E5FF]">Developer's</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            WGP Developer's is a technology and software development company focused on creating innovative digital products and software solutions. Guided by our core philosophy—<strong>Build • Innovate • Grow</strong>—we transform ambitious concepts into robust, production-grade applications that drive real business success.
          </p>
        </div>

        {/* Official Company Brand Showcase */}
        <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-20 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,102,255,0.15)] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2 text-xs font-mono">
            <span className="uppercase tracking-widest text-[#00E5FF]">Official Company Brand Identity</span>
            <span className="text-slate-400">Turning Ideas Into Reality</span>
          </div>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#030508] border border-slate-800/80 flex items-center justify-center p-2 sm:p-4">
            <img
              src="/assets/aistudio/file_0000000097808211aebe646ad6bd8207_464d849d.png"
              alt="WGP Developer's Official Brand Design"
              className="w-full h-auto max-h-[520px] object-contain rounded-xl"
              style={{ objectFit: 'contain' }}
              loading="eager"
            />
          </div>
        </div>

        {/* Mission, Vision, Approach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#00E5FF] mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Choose WGP Developer's */}
        <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-slate-800">
          <div className="max-w-2xl mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why Choose WGP Developer's?
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              We stand apart through our commitment to technical precision, transparent collaboration, and tangible business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00E5FF] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white mb-1.5">
                    {adv.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

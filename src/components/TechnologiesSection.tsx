/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Code2,
  Boxes,
  Database,
  GitBranch,
  Bot,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  FileCode,
} from 'lucide-react';

interface TechItem {
  name: string;
  category: 'Language' | 'Frontend & 3D' | 'Backend & Cloud' | 'Tooling';
  description: string;
  proficiency: string;
  icon: React.ElementType;
}

export const TechnologiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const technologies: TechItem[] = [
    {
      name: 'Python',
      category: 'Language',
      description: 'Used for robust machine learning pipelines, data processing, backend automation, and algorithmic microservices.',
      proficiency: 'Core Stack',
      icon: Terminal,
    },
    {
      name: 'JavaScript / TypeScript',
      category: 'Language',
      description: 'Modern type-safe engineering for both responsive web clients, node services, and interactive browser applications.',
      proficiency: 'Core Stack',
      icon: Code2,
    },
    {
      name: 'Three.js & WebGL',
      category: 'Frontend & 3D',
      description: 'High-performance 3D scene creation, mathematical shaders, procedural geometry, lighting rigs, and smooth camera choreography.',
      proficiency: 'Specialty',
      icon: Boxes,
    },
    {
      name: 'React 19 & Vite',
      category: 'Frontend & 3D',
      description: 'Ultra-fast Single Page Application architecture with sub-millisecond build cycles, state management, and modern component hierarchies.',
      proficiency: 'Core Stack',
      icon: Layers,
    },
    {
      name: 'HTML5 & Modern CSS3',
      category: 'Frontend & 3D',
      description: 'Semantic accessible markup, Tailwind CSS architecture, WCAG compliance, and fluid responsive grid layouts.',
      proficiency: 'Core Stack',
      icon: FileCode,
    },
    {
      name: 'Flask & Express',
      category: 'Backend & Cloud',
      description: 'High-throughput RESTful API servers, secure token management, middleware orchestration, and database integrations.',
      proficiency: 'Core Stack',
      icon: Cpu,
    },
    {
      name: 'Enterprise AI APIs',
      category: 'Backend & Cloud',
      description: 'Gemini, custom LLM agents, vector embeddings, semantic search, and streaming interactive intelligence pipelines.',
      proficiency: 'Specialty',
      icon: Bot,
    },
    {
      name: 'Databases & Storage',
      category: 'Backend & Cloud',
      description: 'PostgreSQL, SQLite, Redis caching, and persistent JSON document stores with strict schema integrity and transaction safety.',
      proficiency: 'Core Stack',
      icon: Database,
    },
    {
      name: 'GitHub CI/CD & DevOps',
      category: 'Tooling',
      description: 'Automated test pipelines, version control governance, release automation, Docker containerization, and Cloud Run deployments.',
      proficiency: 'Core Stack',
      icon: GitBranch,
    },
  ];

  const categories = ['All', 'Frontend & 3D', 'Backend & Cloud', 'Language', 'Tooling'];

  const filtered =
    activeCategory === 'All'
      ? technologies
      : technologies.filter((t) => t.category === activeCategory);

  return (
    <section id="technologies" className="relative py-28 bg-[#070A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
              <span>Technical Arsenal</span>
              <span aria-hidden="true">·</span>
              <span>Modern Tooling</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Technologies & <span className="text-[#00E5FF]">Stack</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We build on verified, battle-tested modern frameworks and languages that guarantee performance, enterprise security, and long-term maintainability.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center flex-wrap gap-2 p-1.5 bg-[#0B0F19] rounded-xl border border-slate-800 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800/90 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {item.proficiency}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{item.category}</span>
                  <span className="text-cyan-400/80">Production Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

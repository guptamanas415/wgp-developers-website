/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  status: string;
  liveUrl: string;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOrderService?: (serviceName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI Solutions',
    'Website Development',
    'Android App Development',
    'Custom Software Development',
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="projects" className="relative py-28 bg-[#05070B] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
              <span>Selected Portfolio</span>
              <span aria-hidden="true">·</span>
              <span>Engineering Deliverables</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Featured <span className="text-[#00E5FF]">Projects</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore recent production deployments built by WGP Developer's across artificial intelligence, responsive 3D web platforms, and mobile ecosystems.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2 p-1.5 bg-[#0B0F19] rounded-xl border border-slate-800 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800"
              >
                {/* Visual Asset Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Resilient fallback container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Category & Status Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#05070B]/80 text-[#00E5FF] border border-cyan-500/30 backdrop-blur-md">
                      {proj.category}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#00E5FF] transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {/* Technologies list */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#070A12] text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action link */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Production Release
                      </span>
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:text-white transition-colors"
                      >
                        <span>Explore Showcase</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Projects In This Category</h3>
            <p className="text-sm text-slate-400">
              New portfolio case studies will be loaded dynamically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Globe,
  Cpu,
  Smartphone,
  Gamepad2,
  Palette,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  iconName: string;
  features: string[];
}

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Cpu,
  Smartphone,
  Gamepad2,
  Palette,
  Layers,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <section id="services" className="relative py-28 bg-[#070A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
            <span>Specialized Capabilities</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Quality</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Our Professional <span className="text-[#00E5FF]">Services</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From modern responsive 3D web applications and autonomous AI architectures to native Android development and custom enterprise systems, we engineer bespoke digital solutions built for longevity.
          </p>
        </div>

        {/* Services 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.iconName] || Globe;
            return (
              <div
                key={service.id}
                className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar inside Card: Icon & Price */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                        Starting At
                      </div>
                      <div className="text-lg font-bold text-white font-mono">
                        {service.startingPrice}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Features List */}
                  <div className="space-y-2.5 mb-8 border-t border-slate-800/80 pt-6">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Now Button */}
                <button
                  onClick={() => onSelectService(service.id)}
                  className="w-full py-3 px-4 rounded-xl bg-[#0066FF]/20 hover:bg-[#0066FF] border border-[#0066FF]/40 hover:border-transparent text-white font-semibold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

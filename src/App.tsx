/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroThreeScene } from './components/HeroThreeScene';
import { AboutSection } from './components/AboutSection';
import { ServicesSection, ServiceItem } from './components/ServicesSection';
import { ProjectsSection, ProjectItem } from './components/ProjectsSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { OrderSection } from './components/OrderSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Default fallback services if network query is delayed
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'Website Development',
    description: 'High-performance, futuristic responsive 3D web applications, SaaS platforms, and enterprise business websites crafted with cutting-edge frontends.',
    startingPrice: '₹25,000',
    iconName: 'Globe',
    features: [
      'Interactive 3D Three.js experiences',
      'Ultra-fast Vite & React architecture',
      'Mobile-first responsive design',
      'Full SEO & Performance optimization',
      'Custom backend APIs and CMS',
    ],
  },
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    description: 'Intelligent AI workflows, enterprise LLM agents, predictive data analytics, and custom machine learning integrations tailored for business growth.',
    startingPrice: '₹50,000',
    iconName: 'Cpu',
    features: [
      'Gemini & Custom LLM integrations',
      'Automated intelligence pipelines',
      'Semantic search and vector databases',
      'AI chatbot & virtual agents',
      'Automated business decision systems',
    ],
  },
  {
    id: 'android-app-development',
    title: 'Android App Development',
    description: 'Native and cross-platform high-performance Android applications built with modern UI, robust architecture, and smooth user experiences.',
    startingPrice: '₹35,000',
    iconName: 'Smartphone',
    features: [
      'Native Android & Kotlin/Flutter options',
      'Clean MVVM architecture',
      'Offline-first synchronization',
      'Play Store release preparation',
      'Push notifications and analytics',
    ],
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Immersive 2D and 3D web and mobile game experiences with custom physics, procedural visual effects, and fluid gameplay mechanics.',
    startingPrice: '₹60,000',
    iconName: 'Gamepad2',
    features: [
      'WebGL / Three.js 3D game engines',
      'Custom particle systems & shaders',
      'Spatial 3D audio synthesis',
      'Cross-platform touch & gamepad controls',
      'Lossless frame pacing optimization',
    ],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Award-winning digital product design, interactive 3D spatial prototypes, design systems, and user-centered conversion workflows.',
    startingPrice: '₹20,000',
    iconName: 'Palette',
    features: [
      'Futuristic dark & light design systems',
      'High-fidelity interactive prototypes',
      'WCAG AA accessible interfaces',
      'User journey mapping & usability audits',
      'Bespoke visual assets and brand guides',
    ],
  },
  {
    id: 'custom-software-development',
    title: 'Custom Software Development',
    description: 'End-to-end custom business software, scalable cloud microservices, database architecture, and mission-critical API platforms.',
    startingPrice: '₹55,000',
    iconName: 'Layers',
    features: [
      'Microservices & distributed systems',
      'Secure database & cloud migrations',
      'Enterprise security & RBAC systems',
      'Real-time data streaming & websockets',
      'Complete maintenance & SLA support',
    ],
  },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'project-1',
    name: 'Nexus AI Enterprise Platform',
    category: 'AI Solutions',
    description: 'Next-generation enterprise predictive analytics platform featuring real-time telemetry, neural monitoring, and autonomous insight agents.',
    image: '/src/assets/images/project_ai_analytics_1793900313289.jpg',
    technologies: ['React', 'Python', 'AI APIs', 'TypeScript', 'Tailwind CSS'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com',
  },
  {
    id: 'project-2',
    name: 'Quantum Flux Mobile Ecosystem',
    category: 'Android App Development',
    description: 'High-security mobile digital assets experience with biometric validation, real-time sync, and fluid micro-interactions.',
    image: '/src/assets/images/project_mobile_app_1793900313013.jpg',
    technologies: ['Android', 'Kotlin', 'Express', 'Databases', 'Cloud APIs'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com',
  },
  {
    id: 'project-3',
    name: 'SpatialView 3D Web Studio',
    category: 'Website Development',
    description: 'Browser-based 3D spatial engineering viewer with procedural geometry, real-time lighting shaders, and zero-latency inspection.',
    image: '/src/assets/images/project_3d_spatial_1793900313773.jpg',
    technologies: ['Three.js', 'WebGL', 'GSAP', 'HTML5', 'TypeScript'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com',
  },
  {
    id: 'project-4',
    name: 'CloudCore Distributed Architecture',
    category: 'Custom Software Development',
    description: 'High-throughput microservices pipeline delivering ultra-low latency transaction coordination and real-time event streaming.',
    image: '/src/assets/images/project_custom_software_1793900313954.jpg',
    technologies: ['Node.js', 'Express', 'Databases', 'GitHub CI/CD', 'Python'],
    status: 'Production Live',
    liveUrl: 'https://wgpdevelopers.com',
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string | undefined>(undefined);

  // Load dynamic services and projects from backend API
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.services && Array.isArray(data.services)) {
          setServices(data.services);
        }
      })
      .catch((err) => console.log('Using local fallback services:', err));

    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.log('Using local fallback projects:', err));
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  };

  // Called when user clicks "Order Now" on any service card
  const handleSelectServiceFromCard = (serviceId: string) => {
    setSelectedServiceForOrder(serviceId);
    handleNavigate('order');
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col font-sans selection:bg-[#0066FF]/30 selection:text-[#00E5FF]">
      {/* Top Bar Navigation */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Main Website Sections */}
      <main className="flex-1">
        {/* 1. Home Section: Interactive Three.js 3D Experience */}
        <section id="home">
          <HeroThreeScene
            onExploreServices={() => handleNavigate('services')}
            onStartProject={() => handleNavigate('order')}
          />
        </section>

        {/* 2. About Us Section */}
        <AboutSection />

        {/* 3. Our Services Section */}
        <ServicesSection
          services={services}
          onSelectService={handleSelectServiceFromCard}
        />

        {/* 4. Our Projects Section */}
        <ProjectsSection projects={projects} />

        {/* 5. Technologies Section */}
        <TechnologiesSection />

        {/* 6. Place an Order Section */}
        <OrderSection
          services={services}
          preSelectedServiceId={selectedServiceForOrder}
          onClearPreSelected={() => {}}
        />

        {/* 7. Contact Us Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

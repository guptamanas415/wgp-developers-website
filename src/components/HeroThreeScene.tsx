/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, RotateCw, Sparkles, Layers } from 'lucide-react';

interface HeroThreeSceneProps {
  onExploreServices: () => void;
  onStartProject: () => void;
}

export const HeroThreeScene: React.FC<HeroThreeSceneProps> = ({
  onExploreServices,
  onStartProject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [activePreset, setActivePreset] = useState<'cyber' | 'hologram' | 'core'>('cyber');
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  // Mutable refs to prevent React state tearing down Three.js canvas
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    activePreset: 'cyber',
    isZenMode: false,
  });

  useEffect(() => {
    stateRef.current.activePreset = activePreset;
    stateRef.current.isZenMode = isZenMode;
  }, [activePreset, isZenMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software-gl
    const isSoftwareGl = (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to static 3D graphics:', e);
      setWebGlAvailable(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Procedural Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig
    const keyLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0066ff, 3.0);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x05070b, 1.2);
    scene.add(hemiLight);

    // Composite 3D Subject: Procedural "WGP Cyber Core" (6 distinct coordinated parts)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Part 1: Central Icosahedron Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(1.25, isSoftwareGl ? 1 : 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a192f,
      emissive: 0x0066ff,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);

    // Part 2: Outer Wireframe Cage with glow
    const wireGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    heroGroup.add(wireMesh);

    // Part 3: Inner Orbital Ring X
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.035, 12, isSoftwareGl ? 48 : 80);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0066ff,
      emissiveIntensity: 0.8,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    heroGroup.add(ring1);

    // Part 4: Inner Orbital Ring Y
    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.025, 12, isSoftwareGl ? 48 : 80);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.7,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.5;
    heroGroup.add(ring2);

    // Part 5: Orbiting Satellite Octahedron Nodes
    const satelliteGroup = new THREE.Group();
    heroGroup.add(satelliteGroup);
    const satCount = 5;
    const satGeo = new THREE.OctahedronGeometry(0.2, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0066ff,
      emissiveIntensity: 0.9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.85;
      sat.position.set(Math.cos(angle) * radius, (i % 2 === 0 ? 0.4 : -0.4), Math.sin(angle) * radius);
      satelliteGroup.add(sat);
      satellites.push(sat);
    }

    // Part 6: Soft Radial Contact Shadow Grounding Disc
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 102, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(5, 7, 11, 0.3)');
      grad.addColorStop(1, 'rgba(5, 7, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -2.3;
    scene.add(shadowDisc);

    // Floating Ambient Dust Nodes (InstancedMesh)
    const particleCount = isSoftwareGl ? 35 : 90;
    const particleGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const particlePositions: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      particlePositions.push(pos);
      dummy.position.copy(pos);
      dummy.updateMatrix();
      instancedParticles.setMatrixAt(i, dummy.matrix);
    }
    instancedParticles.instanceMatrix.needsUpdate = true;
    scene.add(instancedParticles);

    // Event handlers for mouse & touch interaction
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.mouseX = x;
      stateRef.current.mouseY = y;
      stateRef.current.targetRotationY = x * 0.75;
      stateRef.current.targetRotationX = -y * 0.5;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 650;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Render Loop using high-precision performance.now
    let frameId = 0;
    let lastTime = performance.now();
    let startTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = (now - startTime) / 1000;

      // Smooth exponential damping toward pointer
      heroGroup.rotation.y = THREE.MathUtils.damp(
        heroGroup.rotation.y,
        stateRef.current.targetRotationY + time * 0.15,
        3.0,
        delta
      );
      heroGroup.rotation.x = THREE.MathUtils.damp(
        heroGroup.rotation.x,
        stateRef.current.targetRotationX + Math.sin(time * 0.5) * 0.1,
        3.0,
        delta
      );

      // Coordinate rotating rings
      ring1.rotation.z += delta * 0.45;
      ring1.rotation.x += delta * 0.2;
      ring2.rotation.y += delta * 0.35;
      ring2.rotation.z -= delta * 0.25;

      wireMesh.rotation.y -= delta * 0.2;
      wireMesh.rotation.x += delta * 0.15;

      // Orbit satellite nodes
      satelliteGroup.rotation.y += delta * 0.6;
      satellites.forEach((sat, i) => {
        sat.rotation.x += delta * 1.5;
        sat.rotation.y += delta * 2.0;
        sat.position.y += Math.sin(time * 2 + i) * 0.003;
      });

      // Animate ambient particles slowly
      for (let i = 0; i < particleCount; i++) {
        const orig = particlePositions[i];
        dummy.position.set(
          orig.x,
          orig.y + Math.sin(time * 0.8 + i) * 0.25,
          orig.z + Math.cos(time * 0.6 + i) * 0.25
        );
        dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, dummy.matrix);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;

      // Preset color response
      if (stateRef.current.activePreset === 'hologram') {
        coreMat.emissive.setHex(0x00e5ff);
        coreMat.emissiveIntensity = 0.85;
      } else if (stateRef.current.activePreset === 'core') {
        coreMat.emissive.setHex(0x38bdf8);
        coreMat.emissiveIntensity = 0.5;
      } else {
        coreMat.emissive.setHex(0x0066ff);
        coreMat.emissiveIntensity = 0.65;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Context loss safety
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Pausing render loop.');
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const handleContextRestored = () => {
      console.info('WebGL context restored. Resuming render loop.');
      tick();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      // Clean disposal
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      satGeo.dispose();
      satMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      instancedParticles.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#05070B] pt-20 pb-16">
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        data-testid="hero-three-canvas"
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      {/* WebGL Fallback if not available */}
      {!webGlAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#05070B] pointer-events-none">
          <div className="w-72 h-72 rounded-full border border-cyan-500/30 bg-gradient-to-tr from-blue-600/20 to-cyan-400/10 blur-xl animate-pulse" />
        </div>
      )}

      {/* Ambient Radial Gradient Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0066FF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Clean DOM UI Overlay: Hero Content Layer */}
      <div
        className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-opacity duration-300 pointer-events-none ${
          isZenMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="p-4 sm:p-6 rounded-3xl bg-[#05070B]/40 sm:bg-transparent backdrop-blur-[3px] sm:backdrop-blur-none border border-white/5 sm:border-transparent inline-block">
          {/* Anti-Slop Discipline: Clean unboxed metadata separator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/40 mb-6 backdrop-blur-md">
            <span>Futuristic Engineering</span>
            <span aria-hidden="true">·</span>
            <span>Next-Gen Full-Stack</span>
            <span aria-hidden="true">·</span>
            <span>Official 3D Studio</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            WGP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-[#00E5FF]">DEVELOPER'S</span>
          </h1>

          {/* Company Tagline & Value Proposition */}
          <p className="text-base sm:text-2xl text-slate-100 font-semibold tracking-wide uppercase mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Build <span className="text-[#00E5FF]">•</span> Innovate <span className="text-[#00E5FF]">•</span> Grow
          </p>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Turning Ideas Into Reality. We architect high-performance websites, enterprise AI systems, mobile applications, and immersive 3D experiences.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <button
              onClick={onStartProject}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#00A3FF] hover:from-[#0052CC] hover:to-[#0088FF] text-white font-semibold text-sm shadow-[0_0_30px_rgba(0,102,255,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              Start Your Project
            </button>

            <button
              onClick={onExploreServices}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-slate-700 hover:border-cyan-400/60 bg-[#0B0F19]/90 hover:bg-[#0E1626] text-slate-200 font-medium text-sm transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm"
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </div>

      {/* Ergonomic Collapsible Bottom 3D Control Dock (Three.js Skill §5) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto max-w-[94vw]">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          aria-label={isZenMode ? 'Show website content overlay' : 'Hide content overlay for full 3D view'}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-[#0B0F19]/80 border border-slate-800 rounded-full transition-colors mb-2 cursor-pointer shadow-md"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isZenMode ? 'Show Content Overlay' : 'Full 3D View'}</span>
        </button>

        {/* Sleek Dock */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0F19]/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
            3D Atmosphere:
          </span>
          <button
            onClick={() => setActivePreset('cyber')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'cyber'
                ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Cyber Blue
          </button>
          <button
            onClick={() => setActivePreset('hologram')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'hologram'
                ? 'bg-[#00E5FF] text-slate-950 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Hologram
          </button>
          <button
            onClick={() => setActivePreset('core')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'core'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Deep Core
          </button>
        </div>
      </div>
    </div>
  );
};

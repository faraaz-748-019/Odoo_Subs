import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Leaf, Users, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from '../components/three/Scene';
import '../landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef();

  useGSAP(() => {
    // Reveal animations for each section
    const sections = gsap.utils.toArray('.scroll-section');
    
    sections.forEach((section, i) => {
      const content = section.querySelector('.content-block');
      if (content) {
        gsap.fromTo(content, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'top 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

  }, { scope: containerRef });

  return (
    <div className="landing-container" ref={containerRef}>
      
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll Overlay Content */}
      <div className="landing-scroll-container">
        
        {/* Section 1: Hero */}
        <section className="scroll-section" style={{ alignItems: 'center', textAlign: 'center', paddingTop: '15vh' }}>
          <div className="content-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="landing-title">The Future of<br/>ESG Intelligence</h1>
            <p className="landing-subtitle">
              Unify your Environmental, Social, and Governance data into a single, actionable digital twin. Empower your workforce with gamified sustainability.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <span className="text-muted text-sm uppercase tracking-widest block mb-4">Scroll to explore</span>
              <div className="animate-spin" style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)', margin: '0 auto' }} />
            </div>
          </div>
        </section>

        {/* Section 2: Environmental */}
        <section className="scroll-section" style={{ alignItems: 'flex-start' }}>
          <div className="content-block landing-glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Leaf size={32} color="#34d399" />
              <h2 className="section-heading text-gradient-env" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Environmental</h2>
            </div>
            <p className="text-lg text-muted mb-6">
              Track carbon footprints, monitor energy consumption, and manage waste reduction across all facilities in real-time.
            </p>
            <div className="flex gap-4">
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                <div className="text-xs text-muted uppercase font-semibold mb-1">CO2 Reduction</div>
                <div className="text-2xl font-bold text-white">-24%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                <div className="text-xs text-muted uppercase font-semibold mb-1">Energy Saved</div>
                <div className="text-2xl font-bold text-white">1.2GWh</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Social & Governance */}
        <section className="scroll-section" style={{ alignItems: 'flex-end' }}>
          <div className="content-block landing-glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Users size={32} color="#fb7185" />
              <Shield size={32} color="#60a5fa" style={{ marginLeft: '1rem' }} />
              <h2 className="section-heading text-gradient-soc" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Social & Gov</h2>
            </div>
            <p className="text-lg text-muted mb-6">
              Foster a diverse workforce, ensure global compliance, and track ethical sourcing standards seamlessly.
            </p>
            <div className="flex gap-4">
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                <div className="text-xs text-muted uppercase font-semibold mb-1">Diversity Score</div>
                <div className="text-2xl font-bold text-white">88/100</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                <div className="text-xs text-muted uppercase font-semibold mb-1">Compliance</div>
                <div className="text-2xl font-bold text-white">99.9%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Launch CTA */}
        <section className="scroll-section" style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <div className="content-block">
            <h2 className="landing-title" style={{ fontSize: '4rem', marginBottom: '1rem' }}>Enter the EcoSphere</h2>
            <p className="landing-subtitle" style={{ margin: '0 auto 3rem auto' }}>
              Your digital command center is ready.
            </p>
            <Link to="/app" className="launch-cta">
              Launch Dashboard <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from '../components/three/Scene';
import '../landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef();

  useGSAP(() => {
    // Reveal animations for typography sections
    const sections = gsap.utils.toArray('.text-reveal-section');
    
    sections.forEach((section) => {
      const content = section.querySelector('.reveal-text');
      if (content) {
        gsap.fromTo(content, 
          { y: 50, opacity: 0, scale: 0.95 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'top 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

  }, { scope: containerRef });

  return (
    <div className="landing-container" ref={containerRef}>
      
      {/* Scroll Overlay Content - Drives the GSAP Timeline in Scene.jsx */}
      <div className="landing-scroll-container">
        
        {/* Section 1: Hero */}
        <section className="scroll-section" style={{ alignItems: 'center', textAlign: 'center', paddingTop: '15vh' }}>
          <div className="text-reveal-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="reveal-text">
              <h1 className="landing-title">The Future of<br/>ESG Intelligence</h1>
              <p className="landing-subtitle">
                Unify your Environmental, Social, and Governance data into a single, actionable digital twin. 
              </p>
            </div>
            <div style={{ marginTop: '3rem', pointerEvents: 'auto' }}>
              <span className="text-muted text-xs uppercase tracking-widest block mb-4">Scroll to explore</span>
              <div className="animate-spin" style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', margin: '0 auto' }} />
            </div>
          </div>
        </section>

        {/* Section 2: Environmental (Triggers 3D panel movement) */}
        <section className="scroll-section text-reveal-section" style={{ alignItems: 'flex-start' }}>
          <div className="reveal-text" style={{ maxWidth: '400px' }}>
            <h2 className="section-heading text-gradient-env">Planetary Scale.</h2>
            <p className="text-lg text-muted">
              Live telemetry from your global facilities, tracking emissions, energy, and water usage in real-time.
            </p>
          </div>
        </section>

        {/* Section 3: Social & Governance (Triggers 3D panel movement) */}
        <section className="scroll-section text-reveal-section" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <div className="reveal-text" style={{ maxWidth: '450px' }}>
            <h2 className="section-heading text-gradient-soc">Human Impact.</h2>
            <p className="text-lg text-muted">
              Ensure diversity, compliance, and ethical sourcing at every level of your organization.
            </p>
          </div>
        </section>

        {/* Section 4: Launch CTA (Triggers final Convergence in 3D) */}
        <section className="scroll-section text-reveal-section" style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <div className="reveal-text" style={{ pointerEvents: 'auto' }}>
            <h2 className="landing-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Enter the EcoSphere</h2>
            <Link to="/app" className="launch-cta">
              Launch Dashboard <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </div>

      {/* 3D Canvas Background - Spans entire viewport. Moved to bottom of DOM so GSAP can find scroll container */}
      <div className="canvas-container">
        {/* Added dpr to cap pixel ratio to 1 or 1.5 to save performance on laptops */}
        <Canvas dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

    </div>
  );
}

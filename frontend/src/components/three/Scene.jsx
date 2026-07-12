import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, RoundedBox, Html, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GlassEarth from './GlassEarth';
import ParticleNetwork from './ParticleNetwork';

gsap.registerPlugin(ScrollTrigger);

// 3D Glass Panel Component
const GlassPanel = React.forwardRef(({ position, color, icon, title, label1, val1, label2, val2 }, ref) => {
  return (
    <group ref={ref} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <RoundedBox args={[3, 2, 0.1]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.9} 
            opacity={1} 
            metalness={0.2} 
            roughness={0.1} 
            ior={1.5}
            thickness={1}
            envMapIntensity={1.5}
          />
        </RoundedBox>
        {/* Border glow */}
        <RoundedBox args={[3.02, 2.02, 0.05]} radius={0.15} smoothness={4}>
          <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
        </RoundedBox>
        
        {/* High-res embedded HTML UI */}
        <Html transform position={[0, 0, 0.06]} scale={0.4} pointerEvents="none">
          <div style={{ 
            width: '320px', 
            background: 'transparent',
            padding: '20px', 
            color: 'white', 
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px' }}>{icon}</span>
              <h3 style={{ fontSize: '24px', margin: 0, fontWeight: 700, color: color }}>{title}</h3>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label1}</div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{val1}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label2}</div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{val2}</div>
              </div>
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
});

export default function Scene() {
  const cameraRef = useRef();
  const sceneGroup = useRef();
  const { viewport } = useThree();

  // Refs for animation targeting
  const earthRef = useRef();
  const envPanel = useRef();
  const socPanel = useRef();
  const govPanel = useRef();
  const gamPanel = useRef();
  const scoreRef = useRef();

  // Subtle mouse parallax
  useFrame((state) => {
    const targetX = (state.mouse.x * viewport.width) / 20;
    const targetY = (state.mouse.y * viewport.height) / 20;
    if (sceneGroup.current) {
      sceneGroup.current.position.x += (targetX - sceneGroup.current.position.x) * 0.05;
      sceneGroup.current.position.y += (targetY - sceneGroup.current.position.y) * 0.05;
    }
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smoother scrub
      }
    });

    // We have 4 scroll sections total.
    // Section 1: Hero (default state)
    
    // Section 2: Zoom to Environmental (Left side of Earth)
    tl.to(cameraRef.current.position, { z: 9, y: 1 }, 0)
      .to(earthRef.current.position, { x: 4 }, 0)
      .to(envPanel.current.position, { x: -3, y: 1, z: 2 }, 0)
      .to(socPanel.current.position, { x: 8, z: -5 }, 0) // Push others away
      .to(govPanel.current.position, { x: 0, y: 8 }, 0);

    // Section 3: Pan to Social & Governance
    tl.to(earthRef.current.position, { x: -3 }, 1)
      .to(envPanel.current.position, { x: -8, z: -5 }, 1)
      .to(socPanel.current.position, { x: 2, y: 2, z: 2 }, 1)
      .to(govPanel.current.position, { x: 2, y: -2, z: 2 }, 1);

    // Section 4: CONVERGENCE!
    // The modules fly into the center (0,0,0) and the camera pulls back.
    // The opacity of the score html goes to 1.
    tl.to(cameraRef.current.position, { z: 12, y: 0 }, 2)
      .to(earthRef.current.position, { x: 0, scale: 0.1 }, 2) // Earth shrinks/implodes
      .to(envPanel.current.position, { x: 0, y: 0, z: 0, scale: 0.1 }, 2)
      .to(socPanel.current.position, { x: 0, y: 0, z: 0, scale: 0.1 }, 2)
      .to(govPanel.current.position, { x: 0, y: 0, z: 0, scale: 0.1 }, 2)
      .to(gamPanel.current.position, { x: 0, y: 0, z: 0, scale: 0.1 }, 2)
      // Reveal the massive Score
      .fromTo(scoreRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }, 2.5);

  }); // No scope provided, targets document

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 16]} fov={45} />
      
      {/* Studio Lighting + HDRI for realistic glass reflections */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#10b981" />
      <Environment preset="studio" /> {/* Essential for Glass rendering */}

      <group ref={sceneGroup}>
        <group ref={earthRef}>
          <GlassEarth />
        </group>

        {/* Floating Panels - Initial Orbit Positions */}
        <GlassPanel ref={envPanel} position={[-6, 2, -2]} color="#10b981" icon="🌱" title="Environmental" label1="CO2 Reduction" val1="-24%" label2="Energy Saved" val2="1.2GWh" />
        <GlassPanel ref={socPanel} position={[6, -2, -2]} color="#f43f5e" icon="👥" title="Social" label1="Diversity" val1="88/100" label2="Compliance" val2="99.9%" />
        <GlassPanel ref={govPanel} position={[0, 6, -4]} color="#3b82f6" icon="🏛️" title="Governance" label1="Risk Score" val1="A+" label2="Audits Passed" val2="100%" />
        <GlassPanel ref={gamPanel} position={[0, -6, -4]} color="#f59e0b" icon="🏆" title="Gamification" label1="Active Users" val1="94%" label2="Tasks Completed" val2="12k+" />

        <ParticleNetwork count={150} /> {/* Optimized count for laptops */}
        
        {/* The Final Converged Score */}
        <Html ref={scoreRef} transform position={[0, 0, 0]} scale={0} pointerEvents="none">
          <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 30px rgba(16,185,129,0.5))' }}>
            <div style={{ fontSize: '18px', color: '#10b981', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Overall ESG Score</div>
            <div style={{ fontSize: '120px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 40px rgba(255,255,255,0.5)' }}>98</div>
          </div>
        </Html>
      </group>

      {/* Post Processing: Bloom - No DepthOfField to save GPU */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.4} 
          mipmapBlur={false} /* Disabled mipmapBlur to run faster on integrated GPUs */
          intensity={1.2} 
        />
      </EffectComposer>
    </>
  );
}

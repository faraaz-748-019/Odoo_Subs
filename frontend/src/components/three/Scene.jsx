import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GlassEarth from './GlassEarth';
import OrbitingModules from './OrbitingModules';
import ParticleNetwork from './ParticleNetwork';

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const cameraRef = useRef();
  const sceneGroup = useRef();
  const { viewport } = useThree();

  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useFrame((state) => {
    // Subtle mouse parallax
    const targetX = (state.mouse.x * viewport.width) / 10;
    const targetY = (state.mouse.y * viewport.height) / 10;
    
    if (sceneGroup.current) {
      sceneGroup.current.position.x += (targetX - sceneGroup.current.position.x) * 0.02;
      sceneGroup.current.position.y += (targetY - sceneGroup.current.position.y) * 0.02;
    }
  });

  useGSAP(() => {
    // Scroll-triggered camera animations
    // The main LandingPage will have sections that drive these animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // 1. Initial State (Hero)
    // 2. Zoom into Earth (Environmental section)
    tl.to(cameraRef.current.position, {
      z: 5,
      y: 1,
      ease: "power2.inOut"
    }, 0);

    // 3. Pan around (Social/Governance)
    tl.to(sceneGroup.current.rotation, {
      y: Math.PI / 2,
      ease: "none"
    }, 0);

    // 4. Final reveal (Convergence)
    tl.to(cameraRef.current.position, {
      z: 12,
      y: 0,
      ease: "power2.out"
    }, ">");
    
  }, { scope: cameraRef });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 15]} fov={45} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#a7f3d0" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#10b981" />
      
      <Environment preset="city" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#050505', 10, 30]} />

      <group ref={sceneGroup}>
        <GlassEarth />
        <OrbitingModules />
        <ParticleNetwork count={300} />
      </group>

      {/* Post Processing: Bloom & Vignette */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

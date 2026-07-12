import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, RoundedBox } from '@react-three/drei';

const ModulePanel = ({ position, color, icon, label, delay = 0 }) => {
  const group = useRef();

  useFrame((state) => {
    // Subtle additional bobbing based on delay
    const t = state.clock.getElapsedTime() + delay;
    group.current.position.y = position[1] + Math.sin(t) * 0.2;
  });

  return (
    <group ref={group} position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <RoundedBox args={[1.5, 0.8, 0.1]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.8} 
            opacity={1} 
            metalness={0.1} 
            roughness={0.1} 
            ior={1.5}
            thickness={0.5}
          />
        </RoundedBox>
        <Html transform position={[0, 0, 0.06]} scale={0.3} style={{ width: '200px', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
            padding: '10px', borderRadius: '12px', border: `1px solid ${color}`,
            color: 'white', fontFamily: 'Inter, sans-serif'
          }}>
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{label}</span>
          </div>
        </Html>
      </Float>
    </group>
  );
};

export default function OrbitingModules() {
  const orbitGroup = useRef();

  useFrame((state, delta) => {
    // Slowly rotate the entire orbit group around the Earth
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={orbitGroup}>
      <ModulePanel position={[-3.5, 1, 0]} color="#10b981" icon="🌱" label="Environmental" delay={0} />
      <ModulePanel position={[3.5, -1, 0]} color="#f43f5e" icon="👥" label="Social" delay={1} />
      <ModulePanel position={[0, 2.5, -3]} color="#3b82f6" icon="🏛️" label="Governance" delay={2} />
      <ModulePanel position={[0, -2.5, 3]} color="#f59e0b" icon="🏆" label="Gamification" delay={3} />
    </group>
  );
}

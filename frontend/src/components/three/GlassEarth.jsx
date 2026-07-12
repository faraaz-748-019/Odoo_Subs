import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function GlassEarth() {
  const earthRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
      earthRef.current.rotation.x += delta * 0.02;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <group>
      {/* Outer Highly Refractive Glass Sphere (Optimized for integrated GPUs) */}
      <Sphere ref={earthRef} args={[2.5, 64, 64]}>
        <MeshTransmissionMaterial
          backside={false} /* Disabled backside for performance */
          thickness={1.5}
          roughness={0.1}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#d1fae5"
          resolution={256} /* Lower resolution for non-GPU laptops */
        />
      </Sphere>
      
      {/* Inner Glowing Core / Digital Twin Grid */}
      <Sphere ref={innerRef} args={[2.3, 32, 32]}>
        <meshStandardMaterial 
          color="#10b981" 
          wireframe 
          transparent 
          opacity={0.3} 
          emissive="#10b981"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Solid inner core to block light and give depth */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color="#022c22" />
      </Sphere>
    </group>
  );
}

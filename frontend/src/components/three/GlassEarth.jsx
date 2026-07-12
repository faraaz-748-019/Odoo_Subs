import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei';

export default function GlassEarth() {
  const earthRef = useRef();

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
      earthRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={5}
          thickness={2}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.1}
          anisotropy={0.3}
          color="#a7f3d0"
        />
      </Sphere>
      {/* Inner subtle wireframe sphere to give it an "Earth" tech look */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.15} />
      </Sphere>
    </group>
  );
}

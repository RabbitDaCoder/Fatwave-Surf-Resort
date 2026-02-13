import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

function FloatingBlob({ position, color, speed = 2, size = 1 }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing({ count = 50, radius = 4, color = "#F76C1E" }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (Math.random() - 0.5) * 2;
    return { x, y, z, size: Math.random() * 0.1 + 0.05 };
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlowingTorus() {
  const torusRef = useRef();

  useFrame(({ clock }) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      torusRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={torusRef} position={[0, 0, -2]}>
      <torusGeometry args={[3, 0.5, 16, 100]} />
      <meshStandardMaterial
        color="#1F4E79"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

export default function FloatingBackground({ variant = "contact" }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F7B733" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#1F4E79"
        />

        {variant === "contact" ? (
          <>
            <FloatingBlob position={[-4, 2, -3]} color="#1F4E79" size={1.5} />
            <FloatingBlob position={[4, -2, -2]} color="#F76C1E" size={1.2} />
            <FloatingBlob position={[0, 3, -4]} color="#F7B733" size={1} />
            <ParticleRing count={40} radius={5} color="#2D6BA8" />
          </>
        ) : (
          <>
            <GlowingTorus />
            <FloatingBlob position={[-3, 1, 0]} color="#F76C1E" size={0.8} />
            <FloatingBlob position={[3, -1, 0]} color="#F7B733" size={0.6} />
            <FloatingBlob position={[0, 2, -1]} color="#2D6BA8" size={0.5} />
          </>
        )}
      </Canvas>
    </div>
  );
}

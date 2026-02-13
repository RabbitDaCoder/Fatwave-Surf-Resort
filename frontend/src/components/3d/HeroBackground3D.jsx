import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Animated ocean wave mesh
function OceanWaves() {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(30, 15, 64, 32);
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const waveX = Math.sin(x * 0.3 + time * 0.8) * 0.4;
        const waveY = Math.sin(y * 0.2 + time * 0.6) * 0.3;
        positions.setZ(i, waveX + waveY);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -4, -5]} rotation={[-Math.PI / 3, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#1F4E79"
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}

// Glowing sun sphere
function SunSphere() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[8, 5, -10]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#F7B733"
          emissive="#F76C1E"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[8, 5, -10]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[4, 0.1, 8, 64]} />
        <meshStandardMaterial
          color="#F7B733"
          emissive="#F76C1E"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}

// Floating tropical blobs
function TropicalBlobs() {
  const blobData = [
    { position: [-6, 3, -3], color: "#F76C1E", size: 0.8, speed: 1.5 },
    { position: [6, 2, -2], color: "#1F4E79", size: 0.6, speed: 2 },
    { position: [-4, -1, -2], color: "#F7B733", size: 0.5, speed: 1.8 },
    { position: [5, 4, -4], color: "#2D6BA8", size: 0.7, speed: 1.2 },
    { position: [-8, 1, -5], color: "#F76C1E", size: 0.4, speed: 2.2 },
  ];

  return (
    <>
      {blobData.map((blob, index) => (
        <Float
          key={index}
          speed={blob.speed}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <Sphere args={[blob.size, 32, 32]} position={blob.position}>
            <MeshDistortMaterial
              color={blob.color}
              speed={3}
              distort={0.4}
              radius={1}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

// Floating surfboard
function Surfboard() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.3 + 1;
    }
  });

  return (
    <group ref={groupRef} position={[-5, 1, -2]} rotation={[0.2, 0.5, 0.1]}>
      {/* Surfboard body */}
      <mesh>
        <capsuleGeometry args={[0.25, 2.5, 8, 16]} />
        <meshStandardMaterial color="#F4EDE3" />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 0, 0.26]}>
        <boxGeometry args={[0.08, 2, 0.02]} />
        <meshStandardMaterial color="#F76C1E" />
      </mesh>
      {/* Fin */}
      <mesh position={[0, -1, -0.15]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.12, 0.35, 4]} />
        <meshStandardMaterial color="#1F4E79" />
      </mesh>
    </group>
  );
}

// Particle system for sparkle effect
function SparkleParticles({ count = 50 }) {
  const particlesRef = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 10 - 3,
      size: Math.random() * 0.04 + 0.01,
      speed: Math.random() * 0.5 + 0.3,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      particlesRef.current.children.forEach((particle, i) => {
        const data = particles[i];
        particle.position.y = data.y + Math.sin(time * data.speed + i) * 0.5;
        particle.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.3;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#F7B733"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Hero Scene
function HeroScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#F7B733" />
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#1F4E79" />
      <spotLight
        position={[0, 15, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#FFFFFF"
      />

      {/* Scene elements */}
      <SunSphere />
      <OceanWaves />
      <TropicalBlobs />
      <Surfboard />
      <SparkleParticles count={60} />
    </>
  );
}

// Export component
export default function HeroBackground3D({ className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <HeroScene />
      </Canvas>
    </div>
  );
}

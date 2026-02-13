import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedWave({ position = [0, 0, 0], color = "#1F4E79", speed = 1 }) {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 64, 64);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed;
    const positions = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const waveX = Math.sin(x * 0.5 + time) * 0.5;
      const waveY = Math.sin(y * 0.3 + time * 0.8) * 0.3;
      positions.setZ(i, waveX + waveY);
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2.5, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        wireframe={false}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function FloatingSphere({ position, color, size = 1 }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={1} />
      </mesh>
    </Float>
  );
}

function SunSphere() {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={[8, 6, -5]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#F7B733"
          emissive="#F76C1E"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Surfboard() {
  const surfboardRef = useRef();

  useFrame(({ clock }) => {
    if (surfboardRef.current) {
      surfboardRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      surfboardRef.current.position.y =
        Math.sin(clock.getElapsedTime()) * 0.3 + 2;
    }
  });

  return (
    <group ref={surfboardRef} position={[0, 2, 0]} rotation={[0.3, 0, 0.1]}>
      {/* Surfboard body */}
      <mesh>
        <capsuleGeometry args={[0.3, 3, 8, 16]} />
        <meshStandardMaterial color="#F4EDE3" />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.1, 2.5, 0.02]} />
        <meshStandardMaterial color="#F76C1E" />
      </mesh>
      {/* Fin */}
      <mesh position={[0, -1.2, -0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshStandardMaterial color="#1F4E79" />
      </mesh>
    </group>
  );
}

export default function WaveScene({ className = "", minimal = false }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 5, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#2D6BA8"
        />

        <AnimatedWave position={[0, -2, 0]} color="#1F4E79" speed={0.8} />
        <AnimatedWave position={[0, -2.5, 2]} color="#2D6BA8" speed={1.2} />

        {!minimal && (
          <>
            <Surfboard />
            <SunSphere />
            <FloatingSphere position={[-6, 3, -3]} color="#F76C1E" size={0.5} />
            <FloatingSphere position={[5, 4, -2]} color="#F7B733" size={0.4} />
            <FloatingSphere position={[-4, 5, -4]} color="#2D6BA8" size={0.6} />
          </>
        )}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Individual Card that rotates in the carousel
function CarouselCard({
  position,
  rotation,
  image,
  title,
  index,
  activeIndex,
  onClick,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Load texture
  const texture = useTexture(image);
  texture.encoding = THREE.sRGBEncoding;

  const isActive = index === activeIndex;
  const targetScale = isActive ? 1.15 : hovered ? 1.05 : 1;

  useFrame(() => {
    if (meshRef.current) {
      // Smooth scale animation
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox args={[3, 2, 0.1]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={isActive ? 1 : 0.85}
          />
        </RoundedBox>
      </mesh>

      {/* Glow effect for active card */}
      {isActive && (
        <mesh position={[0, 0, -0.1]}>
          <RoundedBox args={[3.2, 2.2, 0.05]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color="#F76C1E"
              emissive="#F76C1E"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </RoundedBox>
        </mesh>
      )}
    </group>
  );
}

// Rotating carousel container
function CarouselRig({ children, radius = 5, autoRotate = true, activeIndex }) {
  const groupRef = useRef();
  const targetRotation = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (autoRotate) {
        // Auto-rotate slowly
        targetRotation.current += delta * 0.1;
      }
      // Smoothly interpolate to target rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current,
        0.05,
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {children}
    </group>
  );
}

// Floating particles for atmosphere
function FloatingParticles({ count = 30 }) {
  const particlesRef = useRef();

  const particles = Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 10,
    ],
    size: Math.random() * 0.05 + 0.02,
    speed: Math.random() * 0.5 + 0.2,
  }));

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y +=
          Math.sin(clock.getElapsedTime() * particles[i].speed) * 0.002;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color="#F7B733"
            emissive="#F7B733"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Carousel Scene
function CarouselScene({ images, activeIndex, setActiveIndex }) {
  const { camera } = useThree();
  const radius = 5;
  const angleStep = (Math.PI * 2) / images.length;

  // Position camera
  useEffect(() => {
    camera.position.set(0, 0.5, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFFFFF" />
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#F7B733" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#F76C1E"
      />

      {/* Floating particles */}
      <FloatingParticles count={40} />

      {/* Carousel */}
      <CarouselRig radius={radius} autoRotate={true} activeIndex={activeIndex}>
        {images.map((item, index) => {
          const angle = index * angleStep;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;

          return (
            <CarouselCard
              key={index}
              position={[x, 0, z]}
              rotation={[0, -angle + Math.PI, 0]}
              image={item.image}
              title={item.title}
              index={index}
              activeIndex={activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </CarouselRig>

      {/* Ground reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1F4E79"
          transparent
          opacity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}

// Carousel wrapper component
export default function Carousel3D({ items, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className={`relative ${className}`}>
      {/* 3D Canvas */}
      <div className="w-full h-[500px] md:h-[600px]">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0.5, 8], fov: 50 }}
        >
          <CarouselScene
            images={items}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </Canvas>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-sunset w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Active item info overlay */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <h3 className="font-heading text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
          {items[activeIndex]?.title}
        </h3>
        {items[activeIndex]?.subtitle && (
          <p className="text-white/80 mt-2 font-body">
            {items[activeIndex].subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

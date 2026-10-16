import { useRef, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Fallback detection component
class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL initialization failed, falling back to static visual:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Gold Metallic Ribbon Sculpture
function GoldSculpture({ isReducedMotion }: { isReducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array.from({ length: 100 }, (_, i) => {
        const t = i / 100;
        const angle = t * Math.PI * 2;
        const x = Math.sin(angle) * 2.2 + Math.sin(angle * 2) * 0.8;
        const y = Math.cos(angle * 2) * 1.2 + Math.sin(angle * 3) * 0.4;
        const z = Math.cos(angle) * 2.0 + Math.sin(angle * 2) * 0.9;
        return new THREE.Vector3(x, y, z);
      }),
      true
    );
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 180, 0.18, 32, true);
  }, [curve]);

  // Metallic Gold Material
  const goldMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E3C27E'),
      emissive: new THREE.Color('#2A1B00'),
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      specularColor: new THREE.Color('#FFF3D1'),
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && !isReducedMotion) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.12;
      groupRef.current.rotation.z = Math.cos(Date.now() * 0.0002) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={tubeGeometry} material={goldMaterial} castShadow receiveShadow />
      {/* Secondary accent ring */}
      <mesh rotation={[Math.PI / 4, Math.PI / 3, 0]} position={[0.2, 0.1, -0.3]}>
        <torusGeometry args={[1.8, 0.09, 24, 100]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
    </group>
  );
}

// Intertwined Emerald Glass Tubing
function GlassSculpture({ isReducedMotion }: { isReducedMotion: boolean }) {
  const glassGroupRef = useRef<THREE.Group>(null);

  const glassCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array.from({ length: 100 }, (_, i) => {
        const t = i / 100;
        const angle = t * Math.PI * 2;
        const x = Math.cos(angle * 2) * 1.8 + Math.sin(angle) * 0.7;
        const y = Math.sin(angle * 3) * 1.1 + Math.cos(angle) * 0.3;
        const z = Math.sin(angle * 2) * 1.9 + Math.cos(angle * 3) * 0.5;
        return new THREE.Vector3(x, y, z);
      }),
      true
    );
  }, []);

  const glassGeometry = useMemo(() => {
    return new THREE.TubeGeometry(glassCurve, 160, 0.22, 32, true);
  }, [glassCurve]);

  // Optical Tinted Emerald Glass Material
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0F4C33'),
      transmission: 0.88,
      opacity: 0.95,
      transparent: true,
      roughness: 0.04,
      ior: 1.52,
      thickness: 1.4,
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#98FB98'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color('#062418'),
      attenuationDistance: 0.8,
    });
  }, []);

  useFrame((_, delta) => {
    if (glassGroupRef.current && !isReducedMotion) {
      glassGroupRef.current.rotation.y += delta * 0.12;
      glassGroupRef.current.rotation.x = Math.cos(Date.now() * 0.0004) * 0.15;
    }
  });

  return (
    <group ref={glassGroupRef}>
      <mesh geometry={glassGeometry} material={glassMaterial} castShadow receiveShadow />
    </group>
  );
}

// Floating Bokeh Orbs / Atmospheric Particles
function BokehParticles({ count = 35 }: { count?: number }) {
  const pointsRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8 - 1;
      const scale = Math.random() * 0.12 + 0.04;
      const speed = Math.random() * 0.5 + 0.2;
      temp.push({ x, y, z, scale, speed, initialY: y });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.y = p.initialY + Math.sin(time * p.speed + i) * 0.3;
        child.position.x = p.x + Math.cos(time * p.speed * 0.5 + i) * 0.15;
      });
    }
  });

  const particleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3E2B3'),
      emissive: new THREE.Color('#E3C27E'),
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75,
    });
  }, []);

  return (
    <group ref={pointsRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]} material={particleMaterial}>
          <sphereGeometry args={[p.scale, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}

// Interactive Parallax Camera Controller
function CameraRig({ isReducedMotion }: { isReducedMotion: boolean }) {
  const { camera, pointer } = useThree();

  useFrame(() => {
    if (!isReducedMotion) {
      // Gentle cursor parallax
      const targetX = pointer.x * 0.4;
      const targetY = pointer.y * 0.3 + 0.2;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Internal Scene Component
function Scene({ isReducedMotion }: { isReducedMotion: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 5.8]} fov={45} />
      <CameraRig isReducedMotion={isReducedMotion} />

      {/* Lighting Setup matching emerald studio reference */}
      <ambientLight intensity={0.6} color="#0B2B1B" />
      <directionalLight position={[5, 8, 5]} intensity={2.2} color="#FFF5E1" castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={1.0} color="#0B3E27" />
      <pointLight position={[0, 3, 2]} intensity={1.5} color="#F3E5AB" distance={8} />
      <pointLight position={[0, -2, 3]} intensity={1.2} color="#185038" distance={6} />

      {/* 3D Objects */}
      <Float speed={isReducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[0, 0.1, 0]}>
          <GoldSculpture isReducedMotion={isReducedMotion} />
          <GlassSculpture isReducedMotion={isReducedMotion} />
        </group>
      </Float>

      <BokehParticles count={40} />

      {/* Soft reflective studio floor plane */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#061D12"
          roughness={0.2}
          metalness={0.3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      <Environment preset="city" />
    </>
  );
}

// Fallback CSS/Image representation if WebGL is disabled or unsupported
function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0B2B1B] via-[#061D12] to-[#FFF8EF]/20 overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Visual representation ring */}
      <div className="relative w-72 h-72 rounded-full border-2 border-[#D4AF37]/40 shadow-[0_0_80px_rgba(212,175,55,0.2)] animate-pulse flex items-center justify-center">
        <div className="w-56 h-56 rounded-full border border-emerald-400/30 rotate-45 transform" />
      </div>
    </div>
  );
}

export const HeroWebGL = () => {
  const isReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[680px] bg-[#061D12] overflow-hidden flex flex-col justify-between select-none">
      {/* Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <WebGLErrorBoundary fallback={<StaticFallback />}>
          <Canvas
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <Scene isReducedMotion={isReducedMotion} />
          </Canvas>
        </WebGLErrorBoundary>
      </div>

      {/* Content Overlay - Matching Reference Image Composition */}
      <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-12 px-6 text-center pointer-events-none">
        <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center">
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-[#F5EBE1] uppercase drop-shadow-md leading-tight mb-2">
            TIMELESS
            <br />
            RADIANCE
          </h1>
          <p className="font-sans-luxury text-xs sm:text-sm tracking-[0.25em] text-[#E3C27E] uppercase font-light mb-8">
            High Jewelry & Atelier Collections
          </p>

          <a
            href="#products-section"
            className="inline-block px-8 py-3.5 rounded-full border border-[#D4AF37]/60 text-[#F5EBE1] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-sm"
          >
            EXPLORE COLLECTION
          </a>
        </div>
      </div>

      {/* Soft gradient blur at bottom transitioning into custom scroll / body section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#061D12] via-[#061D12]/60 to-transparent pointer-events-none z-10" />
    </section>
  );
};

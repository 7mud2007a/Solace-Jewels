import { useRef, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
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

// Background Gradient Quad Component (Deep Emerald Top -> Sage Mid -> Champagne Bottom)
function BackgroundGradient() {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorTop: { value: new THREE.Color('#08271A') },
        colorMid: { value: new THREE.Color('#10422B') },
        colorBottom: { value: new THREE.Color('#Cbb488') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorTop;
        uniform vec3 colorMid;
        uniform vec3 colorBottom;
        varying vec2 vUv;

        void main() {
          float y = vUv.y;
          vec3 color;
          if (y > 0.4) {
            float t = (y - 0.4) / 0.6;
            color = mix(colorMid, colorTop, t);
          } else {
            float t = y / 0.4;
            color = mix(colorBottom, colorMid, t);
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh position={[0, 0, -4]} scale={[24, 16, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Helper to create ribbon geometry with flat extrusion along a 3D CatmullRomCurve3
function useRibbonGeometry(
  points: THREE.Vector3[],
  ribbonWidth = 0.35,
  ribbonThickness = 0.04
) {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.25);

    // Thin flat rectangle shape with rounded chamfers
    const shape = new THREE.Shape();
    const w = ribbonWidth / 2;
    const h = ribbonThickness / 2;
    shape.moveTo(-w, -h);
    shape.lineTo(w, -h);
    shape.lineTo(w, h);
    shape.lineTo(-w, h);
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 220,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.012,
      bevelThickness: 0.008,
      extrudePath: curve,
    };

    return {
      geometry: new THREE.ExtrudeGeometry(shape, extrudeSettings),
      curve,
    };
  }, [points, ribbonWidth, ribbonThickness]);
}

// Main Emerald Glass Ribbon Stream
function EmeraldGlassRibbon({
  points,
  ribbonWidth = 0.38,
  isReducedMotion,
  speed = 0.4,
  offset = 0,
}: {
  points: THREE.Vector3[];
  ribbonWidth?: number;
  isReducedMotion: boolean;
  speed?: number;
  offset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { geometry } = useRibbonGeometry(points, ribbonWidth, 0.045);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#105A3A'),
      transmission: 0.92,
      opacity: 0.96,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.9,
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#94F8C4'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color('#05261A'),
      attenuationDistance: 0.7,
      reflectivity: 0.9,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current && !isReducedMotion) {
      const t = state.clock.getElapsedTime() * speed + offset;
      meshRef.current.position.y = Math.sin(t) * 0.08;
      meshRef.current.rotation.z = Math.sin(t * 0.7) * 0.02;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={glassMaterial} castShadow receiveShadow />;
}

// Satin Champagne Gold Ribbon Stream
function ChampagneGoldRibbon({
  points,
  ribbonWidth = 0.32,
  isReducedMotion,
  speed = 0.45,
  offset = 1.2,
}: {
  points: THREE.Vector3[];
  ribbonWidth?: number;
  isReducedMotion: boolean;
  speed?: number;
  offset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { geometry } = useRibbonGeometry(points, ribbonWidth, 0.038);

  const goldMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E1C07B'),
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      specularColor: new THREE.Color('#FFF4D6'),
      emissive: new THREE.Color('#221703'),
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current && !isReducedMotion) {
      const t = state.clock.getElapsedTime() * speed + offset;
      meshRef.current.position.y = Math.cos(t) * 0.07;
      meshRef.current.rotation.z = Math.cos(t * 0.6) * 0.025;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={goldMaterial} castShadow receiveShadow />;
}

// Deterministic PRNG helper for pure memoization
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Shimmering Diamond & Emerald Micro Dust Particles
function ShimmerParticles({
  count = 85,
  isReducedMotion,
}: {
  count?: number;
  isReducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const particleData = useMemo(() => {
    const items = [];
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3E2B3'),
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color('#D4AF37'),
      emissiveIntensity: 0.6,
    });

    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#105A3A'),
      transmission: 0.8,
      transparent: true,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 1.1 + 0.1);
      const r2 = seededRandom(i * 1.7 + 0.2);
      const r3 = seededRandom(i * 2.3 + 0.3);
      const r4 = seededRandom(i * 3.1 + 0.4);
      const r5 = seededRandom(i * 4.7 + 0.5);
      const r6 = seededRandom(i * 5.3 + 0.6);

      const x = (r1 - 0.5) * 12;
      const baseWaveY = Math.sin((x / 12) * Math.PI * 2) * 0.6 - 0.2;
      const y = baseWaveY + (r2 - 0.5) * 1.6;
      const z = (r3 - 0.5) * 2.2;
      const scale = r4 * 0.045 + 0.015;
      const speed = r5 * 0.6 + 0.2;
      const rotationSpeed = (r6 - 0.5) * 2.0;
      const isGold = r1 > 0.35;

      items.push({
        position: new THREE.Vector3(x, y, z),
        initialY: y,
        scale,
        speed,
        rotationSpeed,
        material: isGold ? goldMat : emeraldMat,
      });
    }

    return items;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current && !isReducedMotion) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        const p = particleData[i];
        if (p) {
          child.position.y = p.initialY + Math.sin(time * p.speed + i) * 0.18;
          child.position.x = p.position.x + Math.cos(time * p.speed * 0.5 + i) * 0.08;
          child.rotation.x += 0.01 * p.rotationSpeed;
          child.rotation.y += 0.015 * p.rotationSpeed;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particleData.map((p, idx) => (
        <mesh key={idx} position={p.position} material={p.material}>
          <octahedronGeometry args={[p.scale, 0]} />
        </mesh>
      ))}
    </group>
  );
}

// Parallax Interactive Camera Controller
function CameraRig({ isReducedMotion }: { isReducedMotion: boolean }) {
  const camera = useThree((state) => state.camera);
  const pointer = useThree((state) => state.pointer);

  useFrame(() => {
    if (!isReducedMotion && camera) {
      const targetX = pointer.x * 0.35;
      const targetY = pointer.y * 0.25;
      const currentX = camera.position.x;
      const currentY = camera.position.y;
      const nextX = currentX + (targetX - currentX) * 0.04;
      const nextY = currentY + (targetY - currentY) * 0.04;
      camera.position.set(nextX, nextY, camera.position.z);
      camera.lookAt(0, -0.1, 0);
    }
  });

  return null;
}

// Scene Root
function Scene({ isReducedMotion }: { isReducedMotion: boolean }) {
  // Define 3D control points matching horizontal wave composition in reference image
  const primaryGlassPoints = useMemo(() => {
    return [
      new THREE.Vector3(-7.0, 0.9, -0.5),
      new THREE.Vector3(-4.2, -0.4, 0.2),
      new THREE.Vector3(-1.5, -0.7, 0.5),
      new THREE.Vector3(1.2, 0.2, 0.1),
      new THREE.Vector3(3.8, 0.0, -0.2),
      new THREE.Vector3(7.0, 1.0, -0.6),
    ];
  }, []);

  const secondaryGlassPoints = useMemo(() => {
    return [
      new THREE.Vector3(-7.0, 0.2, 0.1),
      new THREE.Vector3(-3.8, -0.8, -0.2),
      new THREE.Vector3(-0.8, -1.1, 0.2),
      new THREE.Vector3(2.0, -0.2, 0.4),
      new THREE.Vector3(4.8, 0.5, 0.0),
      new THREE.Vector3(7.0, 0.7, -0.3),
    ];
  }, []);

  const goldPoints = useMemo(() => {
    return [
      new THREE.Vector3(-7.0, -0.3, -0.2),
      new THREE.Vector3(-3.5, 0.3, 0.4),
      new THREE.Vector3(-1.0, -0.2, 0.1),
      new THREE.Vector3(1.6, -0.5, -0.3),
      new THREE.Vector3(4.2, 0.4, 0.3),
      new THREE.Vector3(7.0, 0.5, -0.1),
    ];
  }, []);

  const fineAccentGlassPoints = useMemo(() => {
    return [
      new THREE.Vector3(-7.0, -0.7, -0.1),
      new THREE.Vector3(-2.8, -1.0, 0.3),
      new THREE.Vector3(0.5, -0.4, 0.0),
      new THREE.Vector3(3.2, -0.3, -0.2),
      new THREE.Vector3(5.5, 0.2, 0.2),
      new THREE.Vector3(7.0, 0.3, -0.2),
    ];
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={42} />
      <CameraRig isReducedMotion={isReducedMotion} />

      {/* Atmospheric & Directional Lighting matching warm champagne and studio emerald tint */}
      <ambientLight intensity={0.7} color="#0B2B1B" />
      <directionalLight position={[6, 9, 5]} intensity={2.6} color="#FFF8EB" castShadow />
      <directionalLight position={[-6, -2, -3]} intensity={1.1} color="#0E422C" />
      <pointLight position={[0, 3, 2.5]} intensity={1.6} color="#F5E2B3" distance={9} />
      <pointLight position={[0, -2.5, 3]} intensity={1.3} color="#D4AF37" distance={7} />

      {/* Backdrop Gradient Quad */}
      <BackgroundGradient />

      {/* Intertwined Wave Streams */}
      <group position={[0, 0, 0]}>
        <EmeraldGlassRibbon points={primaryGlassPoints} ribbonWidth={0.38} isReducedMotion={isReducedMotion} speed={0.35} offset={0} />
        <EmeraldGlassRibbon points={secondaryGlassPoints} ribbonWidth={0.28} isReducedMotion={isReducedMotion} speed={0.4} offset={0.8} />
        <ChampagneGoldRibbon points={goldPoints} ribbonWidth={0.32} isReducedMotion={isReducedMotion} speed={0.38} offset={1.4} />
        <EmeraldGlassRibbon points={fineAccentGlassPoints} ribbonWidth={0.18} isReducedMotion={isReducedMotion} speed={0.42} offset={2.1} />
      </group>

      {/* Sparkling Micro Shimmer Dust */}
      <ShimmerParticles count={85} isReducedMotion={isReducedMotion} />

      {/* Warm champagne studio reflective floor plane */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color="#Bca378"
          roughness={0.22}
          metalness={0.4}
          transparent={true}
          opacity={0.85}
        />
      </mesh>

      <Environment preset="city" />
    </>
  );
}

// Fallback visual representation if WebGL is disabled or unsupported
function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#08271A] via-[#10422B] to-[#Cbb488]/40 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Undulating ribbon placeholder illustration */}
      <div className="relative w-full max-w-2xl h-48 flex items-center justify-center px-8">
        <div className="w-full h-1 bg-gradient-to-r from-emerald-500/10 via-[#D4AF37] to-emerald-500/10 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)]" />
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
    <section className="relative w-full h-screen min-h-[680px] bg-[#08271A] overflow-hidden flex flex-col justify-between select-none">
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

      {/* Content Overlay */}
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

      {/* Soft gradient transition into custom scroll section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#061D12] via-[#061D12]/60 to-transparent pointer-events-none z-10" />
    </section>
  );
};

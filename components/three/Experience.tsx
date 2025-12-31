"use client";

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Float,
  useProgress,
  Html,
  Stars,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
} from "@react-three/drei";
import * as THREE from "three";

// Types
interface CareerSection {
  id: string;
  name: string;
  model: string;
  scrollStart: number;
  scrollEnd: number;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}

// Career path configuration
// Using transformed GLB files EXCEPT for white_tower and ship (user wants original quality)
const CAREER_SECTIONS: CareerSection[] = [
  {
    id: "istanbul-undergrad",
    name: "Istanbul University",
    model: "/assets/maidens_tower-transformed.glb",
    scrollStart: 0.05,
    scrollEnd: 0.15,
    position: [0, -2, -3],  // Moved up and closer
    scale: 1.0,
    rotation: [0, Math.PI / 4, 0],
    color: "#7c3aed",
  },
  {
    id: "aristotle",
    name: "Aristotle University of Thessaloniki",
    model: "/assets/the_white_tower_of_thessaloniki_greece.glb",  // Original GLB for quality
    scrollStart: 0.15,
    scrollEnd: 0.26,
    position: [0, -5, -3],  // Better position
    scale: 0.6,  // Adjusted scale
    rotation: [0, -Math.PI / 6, 0],
    color: "#06b6d4",
  },
  {
    id: "koc",
    name: "Koç University",
    model: "/assets/taksim_tunel-transformed.glb",
    scrollStart: 0.26,
    scrollEnd: 0.35,  // Ends earlier
    position: [0, -2, -4],
    scale: 0.25,
    rotation: [0, Math.PI / 6, 0],
    color: "#10b981",
  },
  {
    id: "houston-uh",
    name: "University of Houston - Seq-N-Edit",
    model: "/assets/turkish_airlines.glb",  // Replaced with Turkish Airlines
    scrollStart: 0.35,
    scrollEnd: 0.48,
    position: [0, -1, -5],
    scale: 0.8,
    rotation: [0, -Math.PI / 6, 0],
    color: "#f97316",
  },
  {
    id: "mdanderson",
    name: "MD Anderson Cancer Center",
    model: "/assets/houston_graffiti_building_photogrammetry.glb",
    scrollStart: 0.45,
    scrollEnd: 0.55,  // Ends before Projects section starts
    position: [2.5, -2.5, -5],
    scale: 0.35,
    rotation: [0, Math.PI / 4, 0],
    color: "#ef4444",
  },
];

// Projects section scroll range - Nobel prize appears here
const PROJECTS_SCROLL_START = 0.55;  // Synced with "My Work" section
const PROJECTS_SCROLL_END = 0.90;

// Nobel Prize Medal model for Projects section
// NOTE: Add wisawa_szymborskas_nobel_prize_medal.glb to /public/assets/ to enable this feature
function NobelPrizeMedal({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const opacityRef = useRef(0);

  // Calculate visibility and rotation based on scroll progress in projects section
  const isInProjectsSection = scrollProgress >= PROJECTS_SCROLL_START && scrollProgress <= PROJECTS_SCROLL_END;
  const projectsProgress = useMemo(() => {
    if (!isInProjectsSection) return 0;
    return (scrollProgress - PROJECTS_SCROLL_START) / (PROJECTS_SCROLL_END - PROJECTS_SCROLL_START);
  }, [scrollProgress, isInProjectsSection]);

  // Try to load the model, fail silently if not found
  useEffect(() => {
    const loader = new THREE.ObjectLoader();
    fetch("/assets/wisawa_szymborskas_nobel_prize_medal.glb")
      .then((res) => {
        if (res.ok) {
          // Model exists, use GLTF loader
          import("three/examples/jsm/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(
              "/assets/wisawa_szymborskas_nobel_prize_medal.glb",
              (gltf) => {
                setScene(gltf.scene);
                setModelLoaded(true);
              },
              undefined,
              () => setModelLoaded(false)
            );
          });
        }
      })
      .catch(() => setModelLoaded(false));
  }, []);

  useFrame((state) => {
    if (ref.current && scene) {
      const time = state.clock.elapsedTime;

      // Smooth opacity transition
      const targetOpacity = isInProjectsSection ? 1 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.05;

      // Position - centered but offset from ship
      ref.current.position.x = -3 + Math.sin(time * 0.2) * 0.2;
      ref.current.position.y = 0.5 + Math.sin(time * 0.3) * 0.1;
      ref.current.position.z = -4;

      // Continuous rotation based on scroll progress + time for extra spin
      ref.current.rotation.y = projectsProgress * Math.PI * 4 + time * 0.3;
      ref.current.rotation.x = Math.sin(time * 0.2) * 0.1;

      ref.current.scale.setScalar(0.8);

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      });
    }
  });

  if (!modelLoaded || !scene) return null;

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={ref} position={[-3, 0.5, -4]} scale={0.8}>
        <primitive object={scene} />
        <pointLight
          position={[0, 0.5, 0]}
          intensity={isInProjectsSection ? 3 : 0}
          color="#ffd700"
          distance={5}
        />
      </group>
    </Float>
  );
}

// Loading component
function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <div className="text-white font-mono text-sm tracking-wider">
          {progress.toFixed(0)}% LOADED
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

// Optimized scroll hook with throttling
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>();
  const lastScrollRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      lastScrollRef.current = window.scrollY;

      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const newProgress = Math.min(1, Math.max(0, lastScrollRef.current / docHeight));
          setProgress(newProgress);
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}

// Ship model - using ORIGINAL GLB for quality
function ShipModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/assets/ship_in_clouds.glb");  // Original GLB
  const ref = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const opacityRef = useRef(0);

  // Determine ship visibility mode
  const shipMode = useMemo(() => {
    for (let i = 0; i < CAREER_SECTIONS.length - 1; i++) {
      const currentEnd = CAREER_SECTIONS[i].scrollEnd;
      const nextStart = CAREER_SECTIONS[i + 1].scrollStart;
      if (scrollProgress >= currentEnd - 0.01 && scrollProgress <= nextStart + 0.01) {
        return "transition";
      }
    }
    if (scrollProgress < CAREER_SECTIONS[0].scrollStart) return "intro";
    if (scrollProgress >= PROJECTS_SCROLL_START && scrollProgress <= PROJECTS_SCROLL_END) {
      return "projects";
    }
    return "hidden";
  }, [scrollProgress]);

  const projectsProgress = useMemo(() => {
    if (shipMode !== "projects") return 0;
    return (scrollProgress - PROJECTS_SCROLL_START) / (PROJECTS_SCROLL_END - PROJECTS_SCROLL_START);
  }, [scrollProgress, shipMode]);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;

      if (shipMode === "projects") {
        // Ship moves from right to left during projects
        ref.current.position.x = 6 - projectsProgress * 12;
        ref.current.position.y = 0 + Math.sin(time * 0.4) * 0.2;
        ref.current.position.z = -5 + Math.sin(projectsProgress * Math.PI) * 3;
        ref.current.rotation.y = -Math.PI / 4 + projectsProgress * Math.PI / 2;
        ref.current.rotation.z = Math.sin(time * 0.3) * 0.03;
        ref.current.scale.setScalar(0.08);  // Smaller to see whole ship
      } else {
        // Centered floating during transitions/intro
        ref.current.position.x = Math.sin(time * 0.15) * 0.3;
        ref.current.position.y = 0 + Math.sin(time * 0.4) * 0.2;
        ref.current.position.z = -3;  // Further back to see whole ship
        ref.current.rotation.y = Math.sin(time * 0.1) * 0.15;
        ref.current.rotation.z = Math.sin(time * 0.25) * 0.03;
        ref.current.scale.setScalar(0.06);  // Smaller scale
      }

      // Smooth opacity
      const targetOpacity = shipMode !== "hidden" ? 1 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.05;

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      });
    }
  });

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0;
        }
      }
    });
  }, [clonedScene]);

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={ref} position={[0, 0, -3]} scale={0.06}>
        <primitive object={clonedScene} />
        <pointLight
          position={[0, 2, 0]}
          intensity={shipMode !== "hidden" ? 2 : 0}
          color="#06b6d4"
          distance={8}
        />
      </group>
    </Float>
  );
}

// Career landmark - optimized
function CareerLandmark({
  section,
  scrollProgress,
  isActive
}: {
  section: CareerSection;
  scrollProgress: number;
  isActive: boolean;
}) {
  const { scene } = useGLTF(section.model);
  const ref = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const opacityRef = useRef(0);

  const visibility = useMemo(() => {
    const fadeIn = 0.012;
    const fadeOut = 0.012;

    if (scrollProgress < section.scrollStart - fadeIn) return 0;
    if (scrollProgress < section.scrollStart + fadeIn) {
      return (scrollProgress - (section.scrollStart - fadeIn)) / (fadeIn * 2);
    }
    if (scrollProgress < section.scrollEnd - fadeOut) return 1;
    if (scrollProgress < section.scrollEnd + fadeOut) {
      return 1 - (scrollProgress - (section.scrollEnd - fadeOut)) / (fadeOut * 2);
    }
    return 0;
  }, [scrollProgress, section]);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;

      // Smooth opacity
      opacityRef.current += (visibility - opacityRef.current) * 0.08;

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = opacityRef.current;
          // Boost emissive to brighten dark photogrammetry models
          if (mat.emissive) {
            mat.emissive.setScalar(0.2);
          }
          // Increase metalness/roughness for better visibility
          mat.metalness = Math.min(mat.metalness || 0, 0.3);
          mat.roughness = Math.max(mat.roughness || 1, 0.6);
        }
      });

      // Scale and rotation
      const targetScale = section.scale * (0.95 + opacityRef.current * 0.05);
      ref.current.scale.setScalar(ref.current.scale.x + (targetScale - ref.current.scale.x) * 0.06);

      if (isActive && opacityRef.current > 0.5) {
        ref.current.rotation.y = section.rotation[1] + Math.sin(time * 0.15) * 0.03;
      }
    }
  });

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0;
        }
      }
    });
  }, [clonedScene]);

  return (
    <group
      ref={ref}
      position={section.position}
      rotation={section.rotation}
      scale={section.scale}
    >
      <primitive object={clonedScene} />
      <pointLight
        position={[0, 3, 0]}
        intensity={visibility * 3}
        color={section.color}
        distance={10}
      />
    </group>
  );
}

// Simplified particles - fewer count for performance
function CloudParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 150;  // Reduced from 400

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#8b5cf6"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Section indicators - simplified
function SectionIndicators({ scrollProgress }: { scrollProgress: number }) {
  return (
    <group position={[0, -7, 2]}>
      {CAREER_SECTIONS.map((section, index) => {
        const isActive = scrollProgress >= section.scrollStart && scrollProgress <= section.scrollEnd;
        return (
          <mesh key={section.id} position={[(index - 2) * 1.2, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial
              color={section.color}
              transparent
              opacity={isActive ? 1 : 0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main scene - optimized
function SceneContent() {
  const scrollProgress = useScrollProgress();
  const { camera } = useThree();

  const activeSection = useMemo(() => {
    return CAREER_SECTIONS.find(
      (s) => scrollProgress >= s.scrollStart && scrollProgress <= s.scrollEnd
    );
  }, [scrollProgress]);

  // Smoother, less frequent camera updates
  useFrame(() => {
    const targetY = 1 + scrollProgress * 1.5;
    const targetZ = 12 - scrollProgress * 3;

    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
    camera.lookAt(0, -2, -5);
  });

  return (
    <>
      <color attach="background" args={["#050510"]} />

      {/* Improved lighting for dark models */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Colored accents - reduced intensity */}
      <pointLight position={[-6, 4, -2]} intensity={1.2} color="#7c3aed" distance={20} />
      <pointLight position={[6, 4, -2]} intensity={1.2} color="#06b6d4" distance={20} />

      {/* Reduced star count */}
      <Stars
        radius={60}
        depth={30}
        count={800}
        factor={2.5}
        saturation={0.2}
        fade
        speed={0.2}
      />

      <CloudParticles />
      <ShipModel scrollProgress={scrollProgress} />
      <NobelPrizeMedal scrollProgress={scrollProgress} />

      {/* Career landmarks - only render when in range */}
      {CAREER_SECTIONS.map((section) => {
        const inRange = scrollProgress >= section.scrollStart - 0.02 &&
          scrollProgress <= section.scrollEnd + 0.02;
        if (!inRange) return null;

        return (
          <CareerLandmark
            key={section.id}
            section={section}
            scrollProgress={scrollProgress}
            isActive={activeSection?.id === section.id}
          />
        );
      })}

      <SectionIndicators scrollProgress={scrollProgress} />
    </>
  );
}

// Preload models
useGLTF.preload("/assets/ship_in_clouds.glb");
useGLTF.preload("/assets/maidens_tower-transformed.glb");
useGLTF.preload("/assets/taksim_tunel-transformed.glb");
useGLTF.preload("/assets/the_white_tower_of_thessaloniki_greece.glb");
useGLTF.preload("/assets/turkish_airlines.glb");
useGLTF.preload("/assets/houston_graffiti_building_photogrammetry.glb");
// Nobel Prize medal will be loaded dynamically if available
// useGLTF.preload("/assets/wisawa_szymborskas_nobel_prize_medal.glb");

// Main component with performance optimizations
export default function Experience() {
  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,  // Disable for performance
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{
          position: [0, 2, 16],  // Zoomed out more
          fov: 50,  // Wider field of view
          near: 0.5,
          far: 150,
        }}
        performance={{ min: 0.5 }}  // Adaptive performance
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={<Loader />}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

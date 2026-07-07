"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useProgress, Stars, Preload } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ------------------------------------------------------------------ */
/* Scene ↔ DOM synchronisation                                         */
/*                                                                      */
/* Every overlay section that owns a 3D moment carries a `data-scene`  */
/* attribute. We measure those elements in document space and drive    */
/* model visibility from the real scroll position, so the 3D story     */
/* can never drift out of sync with the text.                          */
/* ------------------------------------------------------------------ */

interface SceneRange {
  top: number;
  bottom: number;
}

type RangesRef = MutableRefObject<Map<string, SceneRange>>;

function useSceneRanges(): RangesRef {
  const rangesRef = useRef<Map<string, SceneRange>>(new Map());

  useEffect(() => {
    const measure = () => {
      const map = new Map<string, SceneRange>();
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        map.set(el.dataset.scene as string, { top, bottom: top + rect.height });
      });
      rangesRef.current = map;
    };

    measure();
    // Re-measure after fonts/images settle layout
    const timers = [400, 1200, 3000].map((t) => window.setTimeout(measure, t));
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return rangesRef;
}

/**
 * Progress + visibility for a scene range.
 * `p` runs 0→1 while the viewport focus line crosses the (padded) range;
 * `fade` ramps up over the first part and down over the last.
 */
function sectionFade(
  range: SceneRange | undefined,
  pad = 0.35,
  ramp = 0.24
): { p: number; fade: number } {
  if (!range) return { p: 0, fade: 0 };
  const vh = window.innerHeight;
  const focus = window.scrollY + vh * 0.5;
  const top = range.top - vh * pad;
  const bottom = range.bottom + vh * pad;
  const p = (focus - top) / Math.max(1, bottom - top);
  if (p <= 0 || p >= 1) return { p: THREE.MathUtils.clamp(p, 0, 1), fade: 0 };
  const edge = Math.min(p / ramp, (1 - p) / ramp, 1);
  const fade = edge * edge * (3 - 2 * edge); // smoothstep
  return { p, fade };
}

/* ------------------------------------------------------------------ */
/* Material-safe fading                                                 */
/*                                                                      */
/* We clone materials once and remember how they were authored.        */
/* Fading multiplies the AUTHORED opacity (the Bosphorus water keeps   */
/* its 22% alpha) and depth-write stays on for opaque surfaces, so     */
/* models never turn into see-through ghosts mid-fade.                 */
/* ------------------------------------------------------------------ */

function prepareMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    // Always draw every mesh of a visible model: guarantees the GPU warm-up
    // covers ALL pipelines (culled meshes would otherwise hit their first,
    // stalling draw mid-scroll), and skips per-frame culling math for
    // hundreds of meshes.
    mesh.frustumCulled = false;
    const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const cloned = source.map((m) => {
      const c = m.clone();
      c.userData.baseOpacity = c.opacity;
      c.userData.baseTransparent = c.transparent;
      c.userData.baseDepthWrite = c.depthWrite;
      return c;
    });
    mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
  });
}

function applyFade(root: THREE.Object3D, fade: number) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      const base = (m.userData.baseOpacity as number) ?? 1;
      const baseTransparent = (m.userData.baseTransparent as boolean) ?? false;
      m.opacity = base * fade;
      if (fade > 0.999) {
        m.transparent = baseTransparent;
        m.depthWrite = (m.userData.baseDepthWrite as boolean) ?? true;
      } else {
        m.transparent = true;
        m.depthWrite = baseTransparent
          ? ((m.userData.baseDepthWrite as boolean) ?? true)
          : true;
      }
    }
  });
}

/**
 * Load a GLB, clone it with private materials, and normalise its size:
 * the model is scaled so its largest dimension equals `size`, with the
 * bounding-box bottom-centre sitting at the group origin. No more
 * per-model magic scale numbers.
 */
function useFittedModel(url: string, size: number, hideNodes?: string[]) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const root = scene.clone(true);
    if (hideNodes?.length) {
      const doomed: THREE.Object3D[] = [];
      root.traverse((o) => {
        if (hideNodes.includes(o.name)) doomed.push(o);
      });
      doomed.forEach((o) => o.parent?.remove(o));
    }
    prepareMaterials(root);
    const box = new THREE.Box3().setFromObject(root);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(dims.x, dims.y, dims.z) || 1;
    root.position.set(-center.x, -box.min.y, -center.z);
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(size / maxDim);
    return wrapper;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, size]);
}

/**
 * GPU warm-up: drei's <Preload> compiles shaders, but on macOS/Metal the
 * first REAL draw of a model can still stall for seconds — and blend-on vs
 * blend-off are separate GPU pipeline states, each compiled on first use.
 * So while the loading curtain is still up we draw EVERY model twice:
 * first at full authored opacity (opaque pipelines), then mid-fade
 * (blended pipelines). After that, scrolling never hits a first-draw stall.
 * Returns the forced warm-up fade, or null once warm-up is over.
 */
const WARM_SLOT_FRAMES = 8; // 4 opaque + 4 blended frames per model
const WARM_SLOTS = 6; // 5 landmarks + medal
const WARM_RESTORE_DPR_FRAME = WARM_SLOT_FRAMES * WARM_SLOTS + 2;
export const WARMUP_DONE_FRAME = WARM_RESTORE_DPR_FRAME + 6;

function useWarmup(slot: number) {
  const framesRef = useRef(0);
  useFrame(() => {
    framesRef.current += 1;
  });
  return () => {
    const f = framesRef.current - slot * WARM_SLOT_FRAMES;
    if (f < 0 || f >= WARM_SLOT_FRAMES) return null;
    return f < WARM_SLOT_FRAMES / 2 ? 1 : 0.5;
  };
}

/**
 * Runs the warm-up at a tiny pixel ratio (pipeline compilation and texture
 * uploads are resolution-independent), restores full resolution just before
 * the curtain lifts, then announces readiness.
 */
function ReadySignal() {
  const setDpr = useThree((s) => s.setDpr);
  const framesRef = useRef(0);
  const restoredRef = useRef(false);
  const sentRef = useRef(false);

  useEffect(() => {
    setDpr(0.4);
  }, [setDpr]);

  useFrame(() => {
    framesRef.current += 1;
    if (!restoredRef.current && framesRef.current >= WARM_RESTORE_DPR_FRAME) {
      restoredRef.current = true;
      setDpr(Math.min(window.devicePixelRatio || 1, 1.5));
    }
    if (!sentRef.current && framesRef.current >= WARMUP_DONE_FRAME) {
      sentRef.current = true;
      window.dispatchEvent(new Event("experience:ready"));
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Career landmarks                                                     */
/* ------------------------------------------------------------------ */

interface LandmarkConfig {
  scene: string; // matches data-scene on the education card wrapper
  model: string;
  size: number;
  position: [number, number, number];
  rotationY: number;
  color: string;
  warmupSlot: number; // GPU warm-up time slot (unique per model)
  floating?: boolean; // airborne models skip the ground rise
}

const LANDMARKS: LandmarkConfig[] = [
  {
    scene: "edu-maidens",
    warmupSlot: 0,
    model: "/assets/maidens_tower-transformed.glb",
    size: 16,
    position: [1.9, -5.6, -8],
    rotationY: Math.PI / 5,
    color: "#7c3aed",
  },
  {
    scene: "edu-whitetower",
    warmupSlot: 1,
    model: "/assets/the_white_tower_of_thessaloniki_greece-transformed.glb",
    size: 19,
    position: [-2.6, -5.8, -8.2],
    rotationY: -0.7,
    color: "#06b6d4",
  },
  {
    scene: "edu-taksim",
    warmupSlot: 2,
    model: "/assets/taksim_tunel-transformed.glb",
    size: 9,
    position: [2.6, -3.0, -6.5],
    rotationY: Math.PI / 7,
    color: "#10b981",
  },
  {
    scene: "edu-airlines",
    warmupSlot: 3,
    model: "/assets/turkish_airlines-transformed.glb",
    size: 5,
    position: [-3.0, -0.9, -6.5],
    rotationY: -Math.PI / 4,
    color: "#f97316",
    floating: true,
  },
  {
    scene: "edu-graffiti",
    warmupSlot: 4,
    model: "/assets/houston_graffiti_building_photogrammetry-transformed.glb",
    size: 12,
    position: [2.4, -2.8, -6],
    rotationY: 1.1,
    color: "#ef4444",
  },
];

function CareerLandmark({
  config,
  ranges,
}: {
  config: LandmarkConfig;
  ranges: RangesRef;
}) {
  const model = useFittedModel(config.model, config.size);
  const groupRef = useRef<THREE.Group>(null);
  const fadeRef = useRef(0);
  const appliedFadeRef = useRef(-1);
  const isWarming = useWarmup(config.warmupSlot);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { p, fade } = sectionFade(ranges.current.get(config.scene));
    fadeRef.current = THREE.MathUtils.damp(fadeRef.current, fade, 8, delta);
    const warm = isWarming();
    const f = warm ?? fadeRef.current;

    group.visible = f > 0.004;
    if (!group.visible) return;

    // Only touch materials while the fade is actually changing
    if (Math.abs(f - appliedFadeRef.current) > 0.0015) {
      applyFade(model, f);
      appliedFadeRef.current = f;
    }

    const t = state.clock.elapsedTime;
    const rise = config.floating ? 0 : (1 - f) * -1.1;
    group.position.set(
      config.position[0],
      config.position[1] + rise + (config.floating ? Math.sin(t * 0.6) * 0.15 : 0),
      config.position[2]
    );
    // The model slowly turns as the visitor scrolls through its story
    group.rotation.y =
      config.rotationY + (p - 0.5) * 0.4 + Math.sin(t * 0.1) * 0.03;
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={model} />
    </group>
  );
}

/**
 * One ALWAYS-MOUNTED accent light that travels between landmarks and tints
 * itself to the active chapter's color. Lights must never mount/unmount or
 * hide with their model group: a change in scene light count forces three.js
 * to recompile every shader program mid-scroll (measured ~700ms stalls).
 */
const ACCENT_TARGET = new THREE.Vector3();
const ACCENT_COLOR = new THREE.Color();

function AccentLight({ ranges }: { ranges: RangesRef }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;

    let best: LandmarkConfig | null = null;
    let bestFade = 0;
    for (const l of LANDMARKS) {
      const { fade } = sectionFade(ranges.current.get(l.scene));
      if (fade > bestFade) {
        bestFade = fade;
        best = l;
      }
    }

    if (best) {
      const k = 1 - Math.exp(-4 * delta);
      ACCENT_TARGET.set(
        best.position[0],
        best.position[1] + 4.5,
        best.position[2] + 2.5
      );
      light.position.lerp(ACCENT_TARGET, k);
      ACCENT_COLOR.set(best.color);
      light.color.lerp(ACCENT_COLOR, k);
    }
    light.intensity = THREE.MathUtils.damp(light.intensity, bestFade * 14, 6, delta);
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 2, -4]}
      intensity={0}
      color="#7c3aed"
      distance={14}
      decay={1.6}
    />
  );
}

/** Fixed gold spot for the medal — always mounted for the same reason. */
function MedalLight({ ranges }: { ranges: RangesRef }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const { fade } = sectionFade(ranges.current.get("projects"), 0.05, 0.15);
    ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, fade * 6, 6, delta);
  });
  return (
    <pointLight
      ref={ref}
      position={[-2.5, 1.2, -3.5]}
      intensity={0}
      color="#ffd700"
      distance={7}
      decay={1.5}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Nobel medal — floats through the publications chapter               */
/* ------------------------------------------------------------------ */

function NobelMedal({ ranges }: { ranges: RangesRef }) {
  const model = useFittedModel(
    "/assets/wisawa_szymborskas_nobel_prize_medal-transformed.glb",
    3.6
  );
  const groupRef = useRef<THREE.Group>(null);
  const fadeRef = useRef(0);
  const appliedFadeRef = useRef(-1);
  const isWarming = useWarmup(5);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { p, fade } = sectionFade(ranges.current.get("projects"), 0.05, 0.15);
    fadeRef.current = THREE.MathUtils.damp(fadeRef.current, fade, 7, delta);
    const f = isWarming() ?? fadeRef.current;
    group.visible = f > 0.004;
    if (!group.visible) return;

    if (Math.abs(f - appliedFadeRef.current) > 0.0015) {
      applyFade(model, f);
      appliedFadeRef.current = f;
    }

    const t = state.clock.elapsedTime;
    group.position.set(
      -3.1 + Math.sin(t * 0.25) * 0.2,
      -0.2 + Math.sin(t * 0.35) * 0.15,
      -5
    );
    // Stand the medal upright (asset lies flat) and spin it like a coin.
    // Tilt -90° about X so the embossed portrait reads right-way-up
    // (+90° lands it upside-down).
    group.rotation.order = "YXZ";
    group.rotation.x = -Math.PI / 2;
    group.rotation.y = p * Math.PI * 3 + t * 0.25;
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={model} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Atmosphere                                                           */
/* ------------------------------------------------------------------ */

function CloudParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 140;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i3 + 1] = (Math.random() - 0.5) * 12;
      arr[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 8;
    }
    return arr;
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

/** Neutral studio reflections so metals & PBR surfaces read correctly
 *  without fetching a remote HDRI. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    if ("environmentIntensity" in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = 0.55;
    }
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function CameraRig() {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const vh = window.innerHeight;
    const total = document.documentElement.scrollHeight - vh;
    const sp = total > 0 ? THREE.MathUtils.clamp(window.scrollY / total, 0, 1) : 0;

    const targetX = state.pointer.x * 0.45;
    const targetY = 1.1 + sp * 1.3 + state.pointer.y * 0.2;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.lookAt(0, -0.8, -6);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Loading curtain                                                      */
/*                                                                      */
/* Covers the page and pauses scrolling until models are downloaded    */
/* AND the GPU warm-up has finished — so the visitor's first scroll    */
/* can never collide with shader compilation or texture uploads.       */
/* ------------------------------------------------------------------ */

function LoadingCurtain() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new Event("experience:loading"));

    const finish = () => setReady(true);
    window.addEventListener("experience:ready", finish);
    // Failsafe: never trap the visitor if WebGL stalls or is unavailable
    const failsafe = window.setTimeout(() => {
      window.dispatchEvent(new Event("experience:ready"));
    }, 20000);

    return () => {
      window.removeEventListener("experience:ready", finish);
      window.clearTimeout(failsafe);
      // If we unmount early (route change), make sure scrolling resumes
      window.dispatchEvent(new Event("experience:ready"));
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = ready ? "" : "hidden";
    if (ready) {
      const t = window.setTimeout(() => setGone(true), 900);
      return () => window.clearTimeout(t);
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [ready]);

  if (gone) return null;

  return (
    <div
      className="loading-screen"
      style={{
        opacity: ready ? 0 : 1,
        transition: "opacity 0.8s ease",
        pointerEvents: ready ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <div className="text-white font-mono text-sm tracking-wider">
          {progress < 100
            ? `${progress.toFixed(0)}% LOADED`
            : "PREPARING THE SCENE"}
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                                */
/* ------------------------------------------------------------------ */

function SceneContent() {
  const ranges = useSceneRanges();

  return (
    <>
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#050510", 18, 46]} />

      <StudioEnvironment />
      <CameraRig />

      {/* Lighting: soft sky/ground wash + key + cool rim.
          Models keep their authored materials — no per-frame clamping.
          IMPORTANT: the light set is constant; adding/removing/hiding a
          light forces three.js to recompile all shaders mid-scroll. */}
      <hemisphereLight args={["#b6c4e0", "#181024", 0.5]} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} color="#fff4e0" />
      <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#7c9cff" />
      <AccentLight ranges={ranges} />
      <MedalLight ranges={ranges} />

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

      <NobelMedal ranges={ranges} />

      {LANDMARKS.map((config) => (
        <CareerLandmark key={config.scene} config={config} ranges={ranges} />
      ))}
    </>
  );
}

// Preload every model (all draco+webp compressed, ~7 MB total)
useGLTF.preload("/assets/maidens_tower-transformed.glb");
useGLTF.preload("/assets/the_white_tower_of_thessaloniki_greece-transformed.glb");
useGLTF.preload("/assets/taksim_tunel-transformed.glb");
useGLTF.preload("/assets/turkish_airlines-transformed.glb");
useGLTF.preload("/assets/houston_graffiti_building_photogrammetry-transformed.glb");
useGLTF.preload("/assets/wisawa_szymborskas_nobel_prize_medal-transformed.glb");

export default function Experience() {
  return (
    <>
      {/* Rendered OUTSIDE .canvas-container: its transform would trap
          position:fixed children below the content overlay */}
      <LoadingCurtain />
      <div className="canvas-container">
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 1.1, 10], fov: 48, near: 0.5, far: 120 }}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            // Skip synchronous shader-status readbacks (getProgramInfoLog):
            // they serialize every program compile into multi-second stalls.
            gl.debug.checkShaderErrors = false;
          }}
        >
          <Suspense fallback={null}>
            <SceneContent />
            <ReadySignal />
            {/* Upload textures & compile shaders during the load screen,
                not mid-scroll */}
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

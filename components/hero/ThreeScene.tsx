"use client";

/**
 * ThreeScene — React Three Fiber pixel-grid scene with multi-plane depth.
 *
 * Architecture (back → front):
 *   FarGrid  : 52×32 sparse points at z=−12, ambient-only wave, slow drift
 *   NearGrid : 32×22 dense points at z=0,  fully mouse-reactive
 *   CameraRig: drives camera in useFrame — position, tilt, scroll zoom-in
 *
 * Key behaviours
 *   • Camera ZOOMS IN as scroll increases (z: 22 → 14) — "falling into grid"
 *   • Camera tilts on mouse X (rotation.z) for spatial roll
 *   • Camera y drifts downward with scroll (subtle descent)
 *   • Near grid wave amplitude grows with scroll progress
 *   • Mouse creates a sharp z-dome — nearby points push toward viewer
 *   • Far grid rotates slowly and reacts gently to mouse y tilt
 */
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Shared mutable side-channel (avoids React re-renders) ────────────────────
const io = { mx: 0, my: 0, scroll: 0, smx: 0, smy: 0 };

// ── CameraRig ─────────────────────────────────────────────────────────────────
// Handles ALL camera motion so grid layers stay purely geometric.
function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;

    // Smooth mouse lerp — slightly slower than before for cinematic feel
    io.smx += (io.mx - io.smx) * 0.042;
    io.smy += (io.my - io.smy) * 0.042;

    // X: orbit with mouse (stronger)
    cam.position.x += (io.smx * 3.2 - cam.position.x) * 0.042;

    // Y: orbit with mouse PLUS slow descent as user scrolls
    cam.position.y += (io.smy * 1.8 - io.scroll * 1.8 - cam.position.y) * 0.042;

    // Z: zoom IN as scroll increases — starts far back, falls forward into grid
    // scroll=0 → z=22  |  scroll=1 → z=14
    cam.position.z += (22 - io.scroll * 8 - cam.position.z) * 0.042;

    // Subtle horizon tilt keyed to mouse X
    cam.rotation.z += (-io.smx * 0.055 - cam.rotation.z) * 0.042;

    // Look slightly toward new scroll Y so grid fills frame on descent
    cam.lookAt(0, io.scroll * 0.8, 0);
  });

  return null;
}

// ── NearGrid — primary, fully mouse-reactive ─────────────────────────────────
function NearGrid() {
  const pointsRef = useRef<THREE.Points>(null);

  const COLS = 32, ROWS = 22, SX = 1.4, SY = 1.4;
  const N    = COLS * ROWS;

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        arr[i++] = (c - (COLS - 1) * 0.5) * SX;
        arr[i++] = (r - (ROWS - 1) * 0.5) * SY;
        arr[i++] = 0;
      }
    return arr;
  }, []);

  const base = useMemo(() => positions.slice(), [positions]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size:           0.075,
      color:          0xffffff,
      transparent:    true,
      opacity:        0.54,
      depthWrite:     false,
      sizeAttenuation: true,  // points closer to camera appear larger — free depth cue
    });
    return { geometry: geo, material: mat };
  }, [positions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    const attr = geometry.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;

    // Map normalised mouse to world-space grid coordinates
    const mwx = io.smx * ((COLS - 1) * SX * 0.5);
    const mwy = io.smy * ((ROWS - 1) * SY * 0.5);

    // Wave amplitude grows as user scrolls — grid becomes more turbulent
    const amplitude = 1.8 + io.scroll * 2.4;

    for (let i = 0; i < N; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const dx = bx - mwx;
      const dy = by - mwy;
      const d  = Math.sqrt(dx * dx + dy * dy);

      // Radial wave decaying with distance
      const waveFade  = Math.max(0, 1 - d / 16);
      const waveZ     = Math.sin(d * 0.52 - t * 2.2) * amplitude * waveFade;

      // Sharp dome under the cursor — nearby points pushed toward viewer
      const mouseDome = Math.max(0, 1 - d / 3.5) * 2.6;

      arr[i * 3 + 2] = waveZ + mouseDome;
    }
    attr.needsUpdate = true;

    // Rotation subtly tracks mouse X (pairs with camera tilt for roll feel)
    pointsRef.current.rotation.z = io.smx * 0.028;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ── FarGrid — secondary depth plane, ambient only ────────────────────────────
// 52×32 sparser points sitting 12 units behind the near grid.
// No mouse-reactive wave — just slow ambient undulation + drift.
// This plane creates the visual "depth between layers" entirely missing before.
function FarGrid() {
  const pointsRef = useRef<THREE.Points>(null);

  const COLS = 52, ROWS = 32, SX = 2.1, SY = 1.9;
  const N    = COLS * ROWS;
  const BASE_Z = -12;

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        arr[i++] = (c - (COLS - 1) * 0.5) * SX;
        arr[i++] = (r - (ROWS - 1) * 0.5) * SY;
        arr[i++] = BASE_Z;
      }
    return arr;
  }, []);

  const base = useMemo(() => positions.slice(), [positions]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size:           0.042,
      color:          0xffffff,
      transparent:    true,
      opacity:        0.2,
      depthWrite:     false,
      sizeAttenuation: true,
    });
    return { geometry: geo, material: mat };
  }, [positions]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    const attr = geometry.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;

    for (let i = 0; i < N; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      // Distance from grid centre (not mouse) — ambient pattern
      const d = Math.sqrt(bx * bx + by * by);
      arr[i * 3 + 2] = BASE_Z + Math.sin(d * 0.22 - t * 0.65) * 2.2;
    }
    attr.needsUpdate = true;

    // Very slow drift rotation — the far plane slowly turns, adding life
    pointsRef.current.rotation.z += delta * 0.012;
    // Gentle y-tilt tracks mouse (parallax between planes)
    pointsRef.current.rotation.y += (io.smx * 0.06 - pointsRef.current.rotation.y) * 0.025;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
export default function ThreeScene() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      io.mx =  (e.clientX / window.innerWidth)  * 2 - 1;
      io.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      io.scroll = window.scrollY / Math.max(1, total);
    };

    window.addEventListener("mousemove", onMove,  { passive: true });
    window.addEventListener("scroll",   onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",   onScroll);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ userSelect: "none", pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 22], fov: 52 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <CameraRig />
        <FarGrid />   {/* back plane — rendered first */}
        <NearGrid />  {/* front plane */}
      </Canvas>
    </div>
  );
}

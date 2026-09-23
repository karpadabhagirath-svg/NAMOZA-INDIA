"use client";
/* eslint-disable react/no-unknown-property -- react-three-fiber JSX intrinsics (intensity, position, etc.) aren't DOM attributes */

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import StatueMesh from "./StatueMesh";

interface StatueCanvasProps {
  progressRef: { current: number };
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff3e0" />
      <directionalLight position={[-4, 1, -3]} intensity={0.35} color="#8c919c" />
      <pointLight position={[0, -1.5, 3]} intensity={0.3} color="#c7a876" />
    </>
  );
}

/**
 * The 3D viewport for the scroll-driven transformation. Dynamically imported
 * with SSR disabled by its parent, and only mounted once the section is near
 * the viewport, so Three.js never weighs down the initial page load.
 */
export default function StatueCanvas({ progressRef }: StatueCanvasProps) {
  const [segments, setSegments] = useState(56);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768;
    setSegments(isSmallScreen ? 26 : 56);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.1, 5.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.setClearColor(new THREE.Color("#000000"), 0);
      }}
    >
      <Lights />
      <StatueMesh progressRef={progressRef} segments={segments} />
    </Canvas>
  );
}


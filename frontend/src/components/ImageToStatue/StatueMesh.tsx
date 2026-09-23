"use client";
/* eslint-disable react/no-unknown-property -- react-three-fiber JSX intrinsics (geometry, material, etc.) aren't DOM attributes */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface StatueMeshProps {
  /** Mutable ref holding the current scroll progress (0-1), updated every frame outside React's render cycle. */
  progressRef: { current: number };
  /** Radial segment count for the lathe geometry — lower on mobile for performance. */
  segments: number;
}

/**
 * A radially-symmetric bust-on-pedestal silhouette (radius, height) pairs,
 * bottom to top. This is a deliberately generic placeholder — elegant enough
 * to read as "a sculpture" without pretending to be a real likeness. Swap for
 * a real scanned/sculpted GLB later without touching the surrounding scroll logic.
 */
const PROFILE: Array<[number, number]> = [
  [0.92, -1.4],
  [0.92, -1.26],
  [0.56, -1.24],
  [0.5, -1.14],
  [0.5, -0.8],
  [0.62, -0.48],
  [0.58, -0.2],
  [0.42, 0.16],
  [0.46, 0.26],
  [0.5, 0.54],
  [0.44, 0.84],
  [0.3, 1.08],
  [0.12, 1.28],
  [0.0, 1.38],
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function StatueMesh({ progressRef, segments }: StatueMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.5), []);

  const geometry = useMemo(() => {
    const points = PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(points, segments);
    geo.computeVertexNormals();
    return geo;
  }, [segments]);

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#9a978f"),
        roughness: 0.9,
        metalness: 0.05,
        clippingPlanes: [clipPlane],
        transparent: true,
        opacity: 0,
      }),
    [clipPlane]
  );

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#c7a876"),
        wireframe: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  const clayColor = useMemo(() => new THREE.Color("#9a978f"), []);
  const goldColor = useMemo(() => new THREE.Color("#c7a876"), []);
  const mixedColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const p = clamp01(progressRef.current);

    // A slow, deliberate reveal-rotation across the whole sequence — never a spin.
    group.rotation.y = p * THREE.MathUtils.degToRad(150);

    // The subject gradually gains solidity: ghostly emergence -> fully solid clay.
    const solidOpacity = lerp(0, 1, clamp01((p - 0.28) / (0.55 - 0.28)));
    solidMaterial.opacity = solidOpacity;

    // A wireframe "digital scaffold" appears once it's a model, and dissolves once printing finishes.
    const wireIn = clamp01((p - 0.3) / (0.42 - 0.3));
    const wireOut = 1 - clamp01((p - 0.78) / (0.86 - 0.78));
    wireMaterial.opacity = 0.55 * Math.min(wireIn, wireOut);

    // The 3D-print build effect: the fully-formed digital model briefly
    // "returns to raw material," then the printer rebuilds it from base to
    // crown. Before/after this window the plane stays fully open (nothing
    // clipped) so the clay-model and finished-statue stages render whole.
    let clipHeight: number;
    if (p < 0.52) {
      clipHeight = 1.5;
    } else if (p < 0.58) {
      clipHeight = lerp(1.5, -1.5, clamp01((p - 0.52) / (0.58 - 0.52)));
    } else if (p < 0.84) {
      clipHeight = lerp(-1.5, 1.5, clamp01((p - 0.58) / (0.84 - 0.58)));
    } else {
      clipHeight = 1.5;
    }
    clipPlane.constant = clipHeight;

    // Final finish: matte clay warms into a premium gold-bronze finish.
    const finishT = clamp01((p - 0.8) / (1 - 0.8));
    mixedColor.copy(clayColor).lerp(goldColor, finishT);
    solidMaterial.color.copy(mixedColor);
    solidMaterial.roughness = lerp(0.9, 0.28, finishT);
    solidMaterial.metalness = lerp(0.05, 0.65, finishT);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={solidMaterial} />
      <mesh geometry={geometry} material={wireMaterial} />
    </group>
  );
}


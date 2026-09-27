import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { scrollSignal } from "@/hooks/useScrollSignal";

const TUNNEL_DEPTH = 620;
const GOLD = "#f0b544";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ticker-like particle dust forming the corridor wall. */
function DataDust() {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rnd = mulberry32(11);
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const angle = rnd() * Math.PI * 2;
      const radius = 3.2 + rnd() * 6.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = -rnd() * TUNNEL_DEPTH;
      sizes[i] = 0.5 + rnd() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={GOLD}
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Thin line-chart traces streaming down the corridor — the fund universe. */
function ChartTraces({ count = 46 }: { count?: number }) {
  const traces = useMemo(() => {
    const rnd = mulberry32(77);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rnd() * 0.4;
      const radius = 2.6 + rnd() * 6.2;
      const drift = (rnd() - 0.5) * 1.4;
      const noise = 0.1 + rnd() * 0.55;
      const segments = 42;
      let level = 0;
      const points: [number, number, number][] = [];
      for (let s = 0; s <= segments; s += 1) {
        level += drift * 0.06 + (rnd() - 0.5) * noise;
        const r = radius + level * 0.32;
        const z = -(s / segments) * TUNNEL_DEPTH;
        points.push([Math.cos(angle) * r, Math.sin(angle) * r, z]);
      }
      return { points, opacity: 0.07 + rnd() * 0.2, width: 0.6 + rnd() * 0.9 };
    });
  }, [count]);

  return (
    <group>
      {traces.map((t, i) => (
        <Line
          key={i}
          points={t.points}
          color={GOLD}
          lineWidth={t.width}
          transparent
          opacity={t.opacity}
          depthWrite={false}
        />
      ))}
    </group>
  );
}

/** The bright convergence point at the end of the corridor: the signal. */
function Signal() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.08;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={[0, 0, -TUNNEL_DEPTH - 30]}>
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color="#fff3d6" />
      </mesh>
      <mesh>
        <sphereGeometry args={[7, 24, 24]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[18, 24, 24]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const smooth = useRef(0);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    smooth.current += (scrollSignal.progress - smooth.current) * (1 - Math.exp(-5 * dt));
    const p = smooth.current;
    camera.position.z = 24 - p * (TUNNEL_DEPTH - 40);
    camera.position.x = Math.sin(p * 5.2) * 1.15;
    camera.position.y = Math.cos(p * 4.1) * 0.85;
    camera.rotation.z = Math.sin(p * 3.4) * 0.07;
    camera.lookAt(0, 0, camera.position.z - 60);
    camera.rotation.z += Math.sin(p * 3.4) * 0.05;
  });

  return null;
}

export default function TunnelCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        flat
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 24], fov: 72, far: 1200 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#08080b"]} />
        <fog attach="fog" args={["#08080b", 40, 300]} />
        <DataDust />
        <ChartTraces />
        <Signal />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_95%)]" />
    </div>
  );
}

import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, Color, SRGBColorSpace } from 'three';
import type { BufferAttribute, Group, InterleavedBufferAttribute, Mesh, PointLight } from 'three';
import type { Line2, LineSegments2 } from 'three-stdlib';
import { BOOT_SCENE_PALETTE } from '../lib/bootPalette';

type TrailPoint = [number, number, number];
type TrailColor = [number, number, number, number];
type TrailLine = Line2 | LineSegments2;

type InboundProfile = {
  start: [number, number];
  controlA: [number, number];
  controlB: [number, number];
  end: [number, number];
  startProgress: number;
  approachDuration: number;
};

type SignalBeacon = {
  id: string;
  color: string;
  height: number;
  size: number;
  glowSize: number;
  lightDistance: number;
  intensity: number;
  phase: number;
  trajectory: InboundProfile;
};

type MotionState = {
  x: number;
  z: number;
  heading: number;
  progress: number;
  cycle: number;
};

const TRAIL_POINT_COUNT = 42;
const TRAIL_RENDER_POINT_COUNT = 88;
const TRAIL_SAMPLE_INTERVAL = 0.04;
const { signalBeacons } = BOOT_SCENE_PALETTE;

const SIGNAL_BEACONS: SignalBeacon[] = [
  {
    id: 'green',
    color: signalBeacons.green,
    height: 23.2,
    size: 0.043,
    glowSize: 0.42,
    lightDistance: 5.8,
    intensity: 2.1,
    phase: 0.2,
    trajectory: {
      start: [-6.35, -4.7],
      controlA: [-5.25, -6.05],
      controlB: [-2.15, -2.4],
      end: [-0.36, -0.2],
      startProgress: 0.18,
      approachDuration: 18.5,
    },
  },
  {
    id: 'white',
    color: signalBeacons.white,
    height: 23,
    size: 0.04,
    glowSize: 0.38,
    lightDistance: 6.1,
    intensity: 2.25,
    phase: 1.4,
    trajectory: {
      start: [-6.55, 1.75],
      controlA: [-4.85, 3.05],
      controlB: [-2.2, 1.05],
      end: [-0.22, 0.14],
      startProgress: 0.24,
      approachDuration: 10.8,
    },
  },
  {
    id: 'blue',
    color: signalBeacons.blue,
    height: 22.8,
    size: 0.042,
    glowSize: 0.44,
    lightDistance: 6.4,
    intensity: 2.35,
    phase: 2.5,
    trajectory: {
      start: [6.4, -3.65],
      controlA: [5.4, -1.15],
      controlB: [2.35, -2.45],
      end: [0.28, -0.24],
      startProgress: 0.14,
      approachDuration: 22,
    },
  },
  {
    id: 'gold',
    color: signalBeacons.gold,
    height: 23.1,
    size: 0.041,
    glowSize: 0.4,
    lightDistance: 6.2,
    intensity: 2.3,
    phase: 3.7,
    trajectory: {
      start: [5.65, 4.6],
      controlA: [3.85, 5.5],
      controlB: [2.4, 1.95],
      end: [0.34, 0.2],
      startProgress: 0.2,
      approachDuration: 14.2,
    },
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  const size = 96;
  const context = canvas.getContext('2d');

  canvas.width = size;
  canvas.height = size;

  if (!context) {
    return new CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );

  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0.86)');
  gradient.addColorStop(0.42, 'rgba(255, 255, 255, 0.22)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.035)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;

  return texture;
}

function smoothProgress(progress: number) {
  return progress * progress * (3 - 2 * progress);
}

function interpolateCubic(
  start: number,
  controlA: number,
  controlB: number,
  end: number,
  progress: number,
) {
  const inverse = 1 - progress;

  return (
    inverse * inverse * inverse * start +
    3 * inverse * inverse * progress * controlA +
    3 * inverse * progress * progress * controlB +
    progress * progress * progress * end
  );
}

function interpolateCubicVelocity(
  start: number,
  controlA: number,
  controlB: number,
  end: number,
  progress: number,
) {
  const inverse = 1 - progress;

  return (
    3 * inverse * inverse * (controlA - start) +
    6 * inverse * progress * (controlB - controlA) +
    3 * progress * progress * (end - controlB)
  );
}

function getInboundPose(beacon: SignalBeacon, elapsed: number): MotionState {
  const { approachDuration, controlA, controlB, end, start, startProgress } = beacon.trajectory;
  const rawProgress = startProgress + elapsed / approachDuration;
  const cycle = Math.floor(rawProgress);
  const progress = rawProgress - cycle;
  const easedProgress = smoothProgress(progress);
  const x = interpolateCubic(start[0], controlA[0], controlB[0], end[0], easedProgress);
  const z = interpolateCubic(start[1], controlA[1], controlB[1], end[1], easedProgress);
  const velocityX = interpolateCubicVelocity(start[0], controlA[0], controlB[0], end[0], easedProgress);
  const velocityZ = interpolateCubicVelocity(start[1], controlA[1], controlB[1], end[1], easedProgress);
  const heading = Math.atan2(velocityZ, velocityX);

  return { x, z, heading, progress, cycle };
}

function createInitialTrail(beacon: SignalBeacon): TrailPoint[] {
  return Array.from({ length: TRAIL_POINT_COUNT }, (_, index) => {
    const age = (TRAIL_POINT_COUNT - 1 - index) * TRAIL_SAMPLE_INTERVAL;
    const pose = getInboundPose(beacon, -age);

    return [pose.x, beacon.height, pose.z];
  });
}

function createTrailColors(color: string, maxAlpha: number): TrailColor[] {
  const trailColor = new Color(color);

  return Array.from({ length: TRAIL_RENDER_POINT_COUNT }, (_, index) => {
    const age = index / (TRAIL_RENDER_POINT_COUNT - 1);
    const fadeIn = clamp((age - 0.1) / 0.9, 0, 1);
    const smoothedFade = fadeIn * fadeIn * (3 - 2 * fadeIn);
    const alpha = Math.pow(smoothedFade, 1.65) * maxAlpha;

    return [trailColor.r, trailColor.g, trailColor.b, alpha];
  });
}

function interpolateTrailValue(a: number, b: number, c: number, d: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;

  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
}

function writeTrailCurvePositions(positions: Float32Array, points: TrailPoint[]) {
  const lastControlIndex = points.length - 1;

  for (let i = 0; i < TRAIL_RENDER_POINT_COUNT; i++) {
    const scaledIndex = (i / (TRAIL_RENDER_POINT_COUNT - 1)) * lastControlIndex;
    const controlIndex = Math.floor(scaledIndex);
    const t = scaledIndex - controlIndex;
    const p0 = points[clamp(controlIndex - 1, 0, lastControlIndex)];
    const p1 = points[clamp(controlIndex, 0, lastControlIndex)];
    const p2 = points[clamp(controlIndex + 1, 0, lastControlIndex)];
    const p3 = points[clamp(controlIndex + 2, 0, lastControlIndex)];
    const offset = i * 3;

    positions[offset] = interpolateTrailValue(p0[0], p1[0], p2[0], p3[0], t);
    positions[offset + 1] = interpolateTrailValue(p0[1], p1[1], p2[1], p3[1], t);
    positions[offset + 2] = interpolateTrailValue(p0[2], p1[2], p2[2], p3[2], t);
  }
}

function createRenderedTrail(points: TrailPoint[]): TrailPoint[] {
  const positions = new Float32Array(TRAIL_RENDER_POINT_COUNT * 3);

  writeTrailCurvePositions(positions, points);

  return Array.from({ length: TRAIL_RENDER_POINT_COUNT }, (_, index) => {
    const offset = index * 3;

    return [positions[offset], positions[offset + 1], positions[offset + 2]];
  });
}

function writeTrailSegmentPositions(segmentPositions: Float32Array, pointPositions: Float32Array) {
  let offset = 0;

  for (let i = 0; i < TRAIL_RENDER_POINT_COUNT - 1; i++) {
    const pointOffset = i * 3;
    const nextPointOffset = pointOffset + 3;

    segmentPositions[offset] = pointPositions[pointOffset];
    segmentPositions[offset + 1] = pointPositions[pointOffset + 1];
    segmentPositions[offset + 2] = pointPositions[pointOffset + 2];
    segmentPositions[offset + 3] = pointPositions[nextPointOffset];
    segmentPositions[offset + 4] = pointPositions[nextPointOffset + 1];
    segmentPositions[offset + 5] = pointPositions[nextPointOffset + 2];
    offset += 6;
  }
}

function getInterleavedBuffer(attribute: BufferAttribute | InterleavedBufferAttribute | undefined) {
  return attribute && 'data' in attribute ? attribute.data : null;
}

function updateTrailLine(line: TrailLine | null, pointPositions: Float32Array, segmentPositions: Float32Array) {
  if (!line) {
    return;
  }

  const startBuffer = getInterleavedBuffer(line.geometry.getAttribute('instanceStart'));
  const endBuffer = getInterleavedBuffer(line.geometry.getAttribute('instanceEnd'));

  if (!startBuffer || startBuffer !== endBuffer || startBuffer.array.length !== segmentPositions.length) {
    line.geometry.setPositions(pointPositions);

    return;
  }

  (startBuffer.array as Float32Array).set(segmentPositions);
  startBuffer.needsUpdate = true;
}

function setTrailHead(points: TrailPoint[], x: number, y: number, z: number) {
  const newestPoint = points[points.length - 1];

  newestPoint[0] = x;
  newestPoint[1] = y;
  newestPoint[2] = z;
}

function advanceTrail(points: TrailPoint[], x: number, y: number, z: number) {
  for (let i = 0; i < points.length - 1; i++) {
    const nextPoint = points[i + 1];
    const point = points[i];

    point[0] = nextPoint[0];
    point[1] = nextPoint[1];
    point[2] = nextPoint[2];
  }

  setTrailHead(points, x, y, z);
}

function resetTrail(points: TrailPoint[], x: number, y: number, z: number) {
  for (const point of points) {
    point[0] = x;
    point[1] = y;
    point[2] = z;
  }
}

function createMotionState(beacon: SignalBeacon): MotionState {
  return getInboundPose(beacon, 0);
}

type MovingBeaconProps = {
  beacon: SignalBeacon;
  glowTexture: CanvasTexture;
};

function MovingBeacon({ beacon, glowTexture }: MovingBeaconProps) {
  const initialPose = useMemo(() => getInboundPose(beacon, 0), [beacon]);
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const coreRef = useRef<Mesh>(null);
  const outerTrailRef = useRef<TrailLine | null>(null);
  const innerTrailRef = useRef<TrailLine | null>(null);
  const motion = useRef(createMotionState(beacon));
  const trailAccumulator = useRef(0);
  const trailRef = useRef(createInitialTrail(beacon));
  const renderedTrail = useMemo(() => createRenderedTrail(trailRef.current), []);
  const trailPositions = useMemo(() => {
    const positions = new Float32Array(TRAIL_RENDER_POINT_COUNT * 3);

    writeTrailCurvePositions(positions, trailRef.current);

    return positions;
  }, []);
  const trailSegmentPositions = useMemo(() => {
    const positions = new Float32Array((TRAIL_RENDER_POINT_COUNT - 1) * 6);

    writeTrailSegmentPositions(positions, trailPositions);

    return positions;
  }, [trailPositions]);
  const outerTrailColors = useMemo(() => createTrailColors(beacon.color, 0.16), [beacon.color]);
  const innerTrailColors = useMemo(() => createTrailColors(beacon.color, 0.48), [beacon.color]);

  useEffect(() => {
    updateTrailLine(outerTrailRef.current, trailPositions, trailSegmentPositions);
    updateTrailLine(innerTrailRef.current, trailPositions, trailSegmentPositions);
  }, [trailPositions, trailSegmentPositions]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const elapsed = clock.elapsedTime;
    const safeDelta = Math.min(delta, 0.045);
    const state = motion.current;
    const pose = getInboundPose(beacon, elapsed);

    const y = beacon.height + Math.sin(elapsed * 1.45 + beacon.phase) * 0.045;
    const pulse = 0.96 + Math.sin(elapsed * 3.1 + beacon.phase) * 0.1;

    group.position.set(pose.x, y, pose.z);
    group.rotation.y = Math.PI / 2 - pose.heading;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse);
    }

    if (lightRef.current) {
      lightRef.current.intensity = beacon.intensity * (0.9 + pulse * 0.12);
    }

    trailAccumulator.current += safeDelta;

    const currentTrail = trailRef.current;

    if (pose.cycle !== state.cycle) {
      resetTrail(currentTrail, pose.x, y, pose.z);
      trailAccumulator.current = 0;
    }

    motion.current = pose;

    while (trailAccumulator.current >= TRAIL_SAMPLE_INTERVAL) {
      trailAccumulator.current -= TRAIL_SAMPLE_INTERVAL;
      advanceTrail(currentTrail, pose.x, y, pose.z);
    }

    setTrailHead(currentTrail, pose.x, y, pose.z);
    writeTrailCurvePositions(trailPositions, currentTrail);
    writeTrailSegmentPositions(trailSegmentPositions, trailPositions);
    updateTrailLine(outerTrailRef.current, trailPositions, trailSegmentPositions);
    updateTrailLine(innerTrailRef.current, trailPositions, trailSegmentPositions);
  });

  return (
    <>
      <Line
        ref={outerTrailRef}
        points={renderedTrail}
        vertexColors={outerTrailColors}
        lineWidth={1.05}
        transparent
        opacity={1}
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        frustumCulled={false}
        renderOrder={24}
        toneMapped={false}
      />
      <Line
        ref={innerTrailRef}
        points={renderedTrail}
        vertexColors={innerTrailColors}
        lineWidth={0.42}
        transparent
        opacity={1}
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        frustumCulled={false}
        renderOrder={25}
        toneMapped={false}
      />
      <group ref={groupRef} position={[initialPose.x, beacon.height, initialPose.z]}>
        <pointLight
          ref={lightRef}
          color={beacon.color}
          distance={beacon.lightDistance}
          intensity={beacon.intensity}
        />
        <sprite renderOrder={30} scale={[beacon.glowSize, beacon.glowSize, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={beacon.color}
            transparent
            opacity={0.5}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
        <sprite renderOrder={31} scale={[beacon.glowSize * 0.34, beacon.glowSize * 0.34, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={beacon.color}
            transparent
            opacity={0.92}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
        <mesh ref={coreRef} renderOrder={32}>
          <sphereGeometry args={[beacon.size, 16, 16]} />
          <meshBasicMaterial
            color={beacon.color}
            transparent
            opacity={1}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}

export function SignalBeacons() {
  const glowTexture = useMemo(createGlowTexture, []);

  useEffect(() => {
    return () => glowTexture.dispose();
  }, [glowTexture]);

  return (
    <group>
      {SIGNAL_BEACONS.map((beacon) => (
        <MovingBeacon key={beacon.id} beacon={beacon} glowTexture={glowTexture} />
      ))}
    </group>
  );
}

import { useMemo } from 'react';
import { BootCameraRig } from './BootCameraRig';
import { BootPostEffects } from './BootPostEffects';
import { MemoryFog } from './MemoryFog';
import { MemoryBlocks, createMemoryBlocks } from './MemoryBlocks';
import { SignalBeacons } from './SignalBeacons';

export function BootWorld() {
  const memoryBlocks = useMemo(createMemoryBlocks, []);

  return (
    <>
      <color attach="background" args={['#040206']} />
      <fog attach="fog" args={['#07030a', 12, 44]} />
      <ambientLight color="#130d1f" intensity={0.045} />
      <hemisphereLight color="#26365f" groundColor="#160506" intensity={0.24} />
      <directionalLight color="#ffd0a1" intensity={0.98} position={[-7.5, 8.5, 5.8]} />
      <directionalLight color="#5dc9ff" intensity={0.9} position={[6.2, 7.2, -6.8]} />
      <directionalLight
        castShadow
        color="#ffe6bc"
        intensity={0.78}
        position={[-3.5, 10.5, 2.2]}
        shadow-bias={-0.00028}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <pointLight color="#ff6a1f" distance={28} intensity={3.7} position={[-6.8, 3.4, 5.2]} />
      <pointLight color="#2e78ff" distance={30} intensity={3.35} position={[5.8, 3.2, -6.4]} />
      <pointLight color="#b251ff" distance={20} intensity={1.55} position={[4.2, 5.2, 5.8]} />
      <pointLight color="#00e0ff" distance={18} intensity={1.5} position={[-4.5, 4.6, -5.2]} />
      <MemoryFog />
      <MemoryBlocks blocks={memoryBlocks} />
      <SignalBeacons />
      <BootCameraRig />
      <BootPostEffects />
    </>
  );
}

import { useMemo } from 'react';
import { BOOT_SCENE_PALETTE } from '../lib/bootPalette';
import { BootCameraRig } from './BootCameraRig';
import { BootPostEffects } from './BootPostEffects';
import { MemoryFog } from './MemoryFog';
import { MemoryBlocks, createMemoryBlocks } from './MemoryBlocks';
import { SignalBeacons } from './SignalBeacons';

type BootWorldProps = {
  performanceMode?: boolean;
};

export function BootWorld({ performanceMode = false }: BootWorldProps) {
  const memoryBlocks = useMemo(
    () => createMemoryBlocks(performanceMode ? 12 : undefined),
    [performanceMode],
  );
  const { world } = BOOT_SCENE_PALETTE;

  return (
    <>
      <color attach="background" args={[world.background]} />
      <fog attach="fog" args={[world.fog, 12, 44]} />

      <ambientLight color={world.ambient} intensity={0.06} />
      <hemisphereLight
        color={world.hemisphereSky}
        groundColor={world.hemisphereGround}
        intensity={0.28}
      />
      <directionalLight color={world.warmKey} intensity={1.14} position={[-7.5, 8.5, 5.8]} />
      <directionalLight color={world.coolRim} intensity={0.56} position={[6.2, 7.2, -6.8]} />
      <directionalLight
        castShadow={!performanceMode}
        color={world.shadowKey}
        intensity={0.86}
        position={[-3.5, 10.5, 2.2]}
        shadow-bias={-0.00028}
        shadow-mapSize-height={performanceMode ? 512 : 1024}
        shadow-mapSize-width={performanceMode ? 512 : 1024}
      />
      <pointLight
        color={world.emberPoint}
        distance={30}
        intensity={4.4}
        position={[-6.8, 3.4, 5.2]}
      />
      <pointLight
        color={world.bluePoint}
        distance={30}
        intensity={2.05}
        position={[5.8, 3.2, -6.4]}
      />
      {!performanceMode ? (
        <>
          <pointLight
            color={world.violetPoint}
            distance={20}
            intensity={1.45}
            position={[4.2, 5.2, 5.8]}
          />
          <pointLight
            color={world.cyanPoint}
            distance={18}
            intensity={0.95}
            position={[-4.5, 4.6, -5.2]}
          />
        </>
      ) : null}

      <MemoryFog />
      <MemoryBlocks blocks={memoryBlocks} />
      {/*<SignalBeacons />*/}
      <BootCameraRig />
      {!performanceMode ? <BootPostEffects /> : null}
    </>
  );
}

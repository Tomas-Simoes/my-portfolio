import { useMemo } from 'react';
import { BOOT_SCENE_PALETTE } from '../lib/bootPalette';
import { BootCameraRig } from './BootCameraRig';
import { BootPostEffects } from './BootPostEffects';
import { MemoryFog } from './MemoryFog';
import { MemoryBlocks, createMemoryBlocks, createMobileMemoryBlocks } from './MemoryBlocks';
import { SignalBeacons } from './SignalBeacons';

type BootWorldProps = {
  performanceMode?: boolean;
  mobileLayout?: boolean;
};

export function BootWorld({ performanceMode = false, mobileLayout = false }: BootWorldProps) {
  const memoryBlocks = useMemo(
    () => (mobileLayout ? createMobileMemoryBlocks() : createMemoryBlocks(performanceMode ? 12 : undefined)),
    [mobileLayout, performanceMode],
  );
  const { world } = BOOT_SCENE_PALETTE;
  const fogNear = mobileLayout ? 16 : 12;
  const fogFar = mobileLayout ? 52 : 44;
  const ambientIntensity = mobileLayout ? 0.2 : 0.06;
  const hemisphereIntensity = mobileLayout ? 0.62 : 0.28;
  const warmKeyIntensity = mobileLayout ? 1.62 : 1.14;
  const coolRimIntensity = mobileLayout ? 0.96 : 0.56;
  const shadowKeyIntensity = mobileLayout ? 1.24 : 0.86;
  const emberPointIntensity = mobileLayout ? 7 : 4.4;
  const bluePointIntensity = mobileLayout ? 4.2 : 2.05;
  const violetPointIntensity = mobileLayout ? 1.45 : 1.45;
  const cyanPointIntensity = mobileLayout ? 1.65 : 0.95;

  return (
    <>
      <color attach="background" args={[world.background]} />
      <fog attach="fog" args={[world.fog, fogNear, fogFar]} />

      <ambientLight color={world.ambient} intensity={ambientIntensity} />
      <hemisphereLight
        color={world.hemisphereSky}
        groundColor={world.hemisphereGround}
        intensity={hemisphereIntensity}
      />
      <directionalLight color={world.warmKey} intensity={warmKeyIntensity} position={[-7.5, 8.5, 5.8]} />
      <directionalLight color={world.coolRim} intensity={coolRimIntensity} position={[6.2, 7.2, -6.8]} />
      <directionalLight
        castShadow={!performanceMode}
        color={world.shadowKey}
        intensity={shadowKeyIntensity}
        position={[-3.5, 10.5, 2.2]}
        shadow-bias={-0.00028}
        shadow-mapSize-height={performanceMode ? 512 : 1024}
        shadow-mapSize-width={performanceMode ? 512 : 1024}
      />
      <pointLight
        color={world.emberPoint}
        distance={30}
        intensity={emberPointIntensity}
        position={[-6.8, 3.4, 5.2]}
      />
      <pointLight
        color={world.bluePoint}
        distance={30}
        intensity={bluePointIntensity}
        position={[5.8, 3.2, -6.4]}
      />
      {!performanceMode || mobileLayout ? (
        <>
          <pointLight
            color={world.violetPoint}
            distance={20}
            intensity={violetPointIntensity}
            position={[4.2, 5.2, 5.8]}
          />
          <pointLight
            color={world.cyanPoint}
            distance={18}
            intensity={cyanPointIntensity}
            position={[-4.5, 4.6, -5.2]}
          />
        </>
      ) : null}

      <MemoryFog mobileLayout={mobileLayout} />
      <MemoryBlocks blocks={memoryBlocks} colorBoost={mobileLayout} />
      {/*<SignalBeacons />*/}
      <BootCameraRig mobileLayout={mobileLayout} />
      {!performanceMode ? <BootPostEffects /> : null}
    </>
  );
}

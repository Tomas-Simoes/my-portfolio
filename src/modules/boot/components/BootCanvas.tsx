import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { usePerformanceMode } from '../../../hooks/usePerformanceMode';
import styles from '../BootSequenceScene.module.css';
import { BOOT_CAMERA } from '../lib/bootSceneConfig';
import { BootWorld } from './BootWorld';

export function BootCanvas() {
  const isPerformanceMode = usePerformanceMode();

  return (
    <div className={styles.canvasStage} aria-hidden="true">
      <Canvas
        camera={BOOT_CAMERA}
        dpr={isPerformanceMode ? [0.75, 1] : [1, 1.75]}
        shadows={!isPerformanceMode}
        gl={{
          alpha: false,
          antialias: !isPerformanceMode,
          powerPreference: isPerformanceMode ? 'default' : 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.94;
        }}
      >
        <BootWorld performanceMode={isPerformanceMode} />
      </Canvas>
    </div>
  );
}

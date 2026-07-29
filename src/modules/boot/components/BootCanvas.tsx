import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import styles from '../BootSequenceScene.module.css';
import { BOOT_CAMERA } from '../lib/bootSceneConfig';
import { BootWorld } from './BootWorld';

export function BootCanvas() {
  return (
    <div className={styles.canvasStage} aria-hidden="true">
      <Canvas
        camera={BOOT_CAMERA}
        dpr={[1, 1.75]}
        shadows
        gl={{ alpha: false, antialias: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.94;
        }}
      >
        <BootWorld />
      </Canvas>
    </div>
  );
}

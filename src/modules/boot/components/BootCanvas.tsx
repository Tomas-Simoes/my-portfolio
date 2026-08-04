import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { ACESFilmicToneMapping } from 'three';
import { usePerformanceMode } from '../../../hooks/usePerformanceMode';
import styles from '../BootSequenceScene.module.css';
import { BOOT_CAMERA, BOOT_MOBILE_CAMERA } from '../lib/bootSceneConfig';
import { BootWorld } from './BootWorld';

const MOBILE_BOOT_LAYOUT_QUERY = '(max-width: 560px)';
const DEFAULT_TONE_MAPPING_EXPOSURE = 0.94;
const MOBILE_TONE_MAPPING_EXPOSURE = 1.32;

function getShouldUseMobileBootLayout() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(MOBILE_BOOT_LAYOUT_QUERY).matches;
}

function useMobileBootLayout() {
  const [isMobileBootLayout, setIsMobileBootLayout] = useState(getShouldUseMobileBootLayout);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_BOOT_LAYOUT_QUERY);
    const updateMobileBootLayout = () => setIsMobileBootLayout(mediaQuery.matches);

    updateMobileBootLayout();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMobileBootLayout);

      return () => mediaQuery.removeEventListener('change', updateMobileBootLayout);
    }

    mediaQuery.addListener(updateMobileBootLayout);

    return () => mediaQuery.removeListener(updateMobileBootLayout);
  }, []);

  return isMobileBootLayout;
}

type BootToneMappingProps = {
  mobileLayout: boolean;
};

function BootToneMapping({ mobileLayout }: BootToneMappingProps) {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = mobileLayout
      ? MOBILE_TONE_MAPPING_EXPOSURE
      : DEFAULT_TONE_MAPPING_EXPOSURE;
  }, [gl, mobileLayout]);

  return null;
}

export function BootCanvas() {
  const isPerformanceMode = usePerformanceMode();
  const isMobileBootLayout = useMobileBootLayout();

  return (
    <div className={styles.canvasStage} aria-hidden="true">
      <Canvas
        camera={isMobileBootLayout ? BOOT_MOBILE_CAMERA : BOOT_CAMERA}
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
        }}
      >
        <BootToneMapping mobileLayout={isMobileBootLayout} />
        <BootWorld performanceMode={isPerformanceMode} mobileLayout={isMobileBootLayout} />
      </Canvas>
    </div>
  );
}

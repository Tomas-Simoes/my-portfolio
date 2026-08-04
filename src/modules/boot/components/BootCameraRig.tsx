import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { BOOT_ROTATION_START_TIME, BOOT_TRANSITION_DURATION } from '../lib/bootTimeline';

const START_HEIGHT = 35;
const FINAL_HEIGHT = 22.2;
const ROTATION_START_HEIGHT = 26.2;
const MOBILE_START_HEIGHT = 36;
const MOBILE_FINAL_HEIGHT = 27.4;
const MOBILE_ROTATION_START_HEIGHT = 30;
const INITIAL_DESCENT_SPEED = 1.35;
const ROTATION_DESCENT_SPEED = 2.05;
const FINAL_DESCENT_SPEED = 1.4;
const DESKTOP_FOV = 70;
const MOBILE_FOV = 72;
const SUBTLE_SEQUENCE_ROTATION = MathUtils.degToRad(16);
const CAMERA_BACKWARD_ROLL = Math.PI;

type CameraHeights = {
  start: number;
  final: number;
  rotationStart: number;
};

const DESKTOP_CAMERA_HEIGHTS: CameraHeights = {
  start: START_HEIGHT,
  final: FINAL_HEIGHT,
  rotationStart: ROTATION_START_HEIGHT,
};

const MOBILE_CAMERA_HEIGHTS: CameraHeights = {
  start: MOBILE_START_HEIGHT,
  final: MOBILE_FINAL_HEIGHT,
  rotationStart: MOBILE_ROTATION_START_HEIGHT,
};

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function interpolateHeight(
  startHeight: number,
  endHeight: number,
  progress: number,
  startVelocity: number,
  endVelocity: number,
  duration: number,
) {
  const clampedProgress = MathUtils.clamp(progress, 0, 1);
  const progressSquared = clampedProgress * clampedProgress;
  const progressCubed = progressSquared * clampedProgress;

  return (
    (2 * progressCubed - 3 * progressSquared + 1) * startHeight +
    (progressCubed - 2 * progressSquared + clampedProgress) * startVelocity * duration +
    (-2 * progressCubed + 3 * progressSquared) * endHeight +
    (progressCubed - progressSquared) * endVelocity * duration
  );
}

function getCameraHeight(elapsed: number, heights: CameraHeights) {
  const clampedElapsed = Math.min(elapsed, BOOT_TRANSITION_DURATION);

  if (clampedElapsed <= BOOT_ROTATION_START_TIME) {
    return interpolateHeight(
      heights.start,
      heights.rotationStart,
      clampedElapsed / BOOT_ROTATION_START_TIME,
      -INITIAL_DESCENT_SPEED,
      -ROTATION_DESCENT_SPEED,
      BOOT_ROTATION_START_TIME,
    );
  }

  const rotationDescentProgress = MathUtils.clamp(
    (clampedElapsed - BOOT_ROTATION_START_TIME) /
      (BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME),
    0,
    1,
  );

  return interpolateHeight(
    heights.rotationStart,
    heights.final,
    rotationDescentProgress,
    -ROTATION_DESCENT_SPEED,
    -FINAL_DESCENT_SPEED,
    BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME,
  );
}

type BootCameraRigProps = {
  mobileLayout?: boolean;
};

export function BootCameraRig({ mobileLayout = false }: BootCameraRigProps) {
  const { camera } = useThree();
  const cameraHeights = mobileLayout ? MOBILE_CAMERA_HEIGHTS : DESKTOP_CAMERA_HEIGHTS;

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    camera.fov = mobileLayout ? MOBILE_FOV : DESKTOP_FOV;
    camera.updateProjectionMatrix();
  }, [camera, mobileLayout]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const cameraHeight = getCameraHeight(elapsed, cameraHeights);
    const rotationProgress = MathUtils.clamp(elapsed / BOOT_TRANSITION_DURATION, 0, 1);
    const leftRotation = SUBTLE_SEQUENCE_ROTATION * easeInOutCubic(rotationProgress);

    camera.position.set(0, cameraHeight, 0);
    camera.rotation.set(-Math.PI / 2, 0, CAMERA_BACKWARD_ROLL - leftRotation);
  });

  return null;
}

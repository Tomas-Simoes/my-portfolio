import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { BOOT_ROTATION_START_TIME, BOOT_TRANSITION_DURATION } from '../lib/bootTimeline';

const START_HEIGHT = 35;
const FINAL_HEIGHT = 22.2;
const ROTATION_START_HEIGHT = 26.2;
const INITIAL_DESCENT_SPEED = 1.35;
const ROTATION_DESCENT_SPEED = 2.05;
const FINAL_DESCENT_SPEED = 1.4;
const FINAL_LEFT_ROTATION = MathUtils.degToRad(90);
const CAMERA_BACKWARD_ROLL = Math.PI;

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

function getCameraHeight(elapsed: number) {
  const clampedElapsed = Math.min(elapsed, BOOT_TRANSITION_DURATION);

  if (clampedElapsed <= BOOT_ROTATION_START_TIME) {
    return interpolateHeight(
      START_HEIGHT,
      ROTATION_START_HEIGHT,
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
    ROTATION_START_HEIGHT,
    FINAL_HEIGHT,
    rotationDescentProgress,
    -ROTATION_DESCENT_SPEED,
    -FINAL_DESCENT_SPEED,
    BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME,
  );
}

export function BootCameraRig() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const cameraHeight = getCameraHeight(elapsed);
    const rotationProgress = MathUtils.clamp(
      (elapsed - BOOT_ROTATION_START_TIME) / (BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME),
      0,
      1,
    );
    const leftRotation = FINAL_LEFT_ROTATION * easeInOutCubic(rotationProgress);

    camera.position.set(0, cameraHeight, 0);
    camera.rotation.set(-Math.PI / 2, 0, CAMERA_BACKWARD_ROLL - leftRotation);
  });

  return null;
}

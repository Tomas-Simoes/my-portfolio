import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { BOOT_ROTATION_START_TIME, BOOT_TRANSITION_DURATION } from '../lib/bootTimeline';

const START_HEIGHT = 35;
const FINAL_HEIGHT = 22.2;
const SLOW_END_TIME = 2;
const SLOW_DESCENT_SPEED = 0.32;
const ROTATION_START_HEIGHT = 26.2;
const FINAL_LEFT_ROTATION = MathUtils.degToRad(90);
const CAMERA_BACKWARD_ROLL = Math.PI;
const SLOW_END_HEIGHT = START_HEIGHT - SLOW_END_TIME * SLOW_DESCENT_SPEED;
const ACCELERATION_DURATION = BOOT_ROTATION_START_TIME - SLOW_END_TIME;
const ACCELERATION_DISTANCE = SLOW_END_HEIGHT - ROTATION_START_HEIGHT;
const DESCENT_ACCELERATION =
  (2 * (ACCELERATION_DISTANCE - SLOW_DESCENT_SPEED * ACCELERATION_DURATION)) /
  ACCELERATION_DURATION ** 2;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function getCameraHeight(elapsed: number) {
  const clampedElapsed = Math.min(elapsed, BOOT_TRANSITION_DURATION);

  if (clampedElapsed <= SLOW_END_TIME) {
    return START_HEIGHT - SLOW_DESCENT_SPEED * clampedElapsed;
  }

  if (clampedElapsed <= BOOT_ROTATION_START_TIME) {
    const accelerationTime = clampedElapsed - SLOW_END_TIME;
    const descentDistance =
      SLOW_DESCENT_SPEED * accelerationTime +
      0.5 * DESCENT_ACCELERATION * accelerationTime ** 2;

    return SLOW_END_HEIGHT - descentDistance;
  }

  const rotationDescentProgress = MathUtils.clamp(
    (clampedElapsed - BOOT_ROTATION_START_TIME) /
      (BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME),
    0,
    1,
  );

  return MathUtils.lerp(
    ROTATION_START_HEIGHT,
    FINAL_HEIGHT,
    easeOutCubic(rotationDescentProgress),
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

import type { InputAction } from './inputActions';

export const inputBindings: Record<InputAction, readonly string[]> = {
  moveForward: ['KeyW'],
  moveBackward: ['KeyS'],
  moveLeft: ['KeyA'],
  moveRight: ['KeyD'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  unlockPointer: ['ControlLeft', 'ControlRight'],
  printCameraSnapshot: ['KeyP'],
  deselectEditorObject: ['Escape'],
  lightDistanceIncrease: ['KeyW'],
  lightDistanceDecrease: ['KeyS'],
  lightIntensityDecrease: ['KeyA'],
  lightIntensityIncrease: ['KeyD'],
  editorTranslate: ['Digit1'],
  editorRotate: ['Digit2'],
  editorScale: ['Digit3'],
  webpageSizeIncrease: ['KeyW'],
  webpageSizeDecrease: ['KeyS'],
  webpageRotateX: ['KeyA'],
  webpageRotateY: ['KeyD'],
};

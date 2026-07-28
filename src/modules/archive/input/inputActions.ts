export type InputAction =
  | 'moveForward'
  | 'moveBackward'
  | 'moveLeft'
  | 'moveRight'
  | 'sprint'
  | 'unlockPointer'
  | 'printCameraSnapshot'
  | 'deselectEditorObject'
  | 'lightDistanceIncrease'
  | 'lightDistanceDecrease'
  | 'lightIntensityDecrease'
  | 'lightIntensityIncrease'
  | 'editorTranslate'
  | 'editorRotate'
  | 'editorScale'
  | 'webpageSizeIncrease'
  | 'webpageSizeDecrease'
  | 'webpageRotateY'
  | 'webpageRotateX';

export type InputPhase = 'started' | 'ended';

export type InputActionEvent = {
  action: InputAction;
  phase: InputPhase;
  keyboardEvent: KeyboardEvent;
};

export type InputActionHandler = (event: InputActionEvent) => void;

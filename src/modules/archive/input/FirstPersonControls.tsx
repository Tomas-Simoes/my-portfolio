import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Euler, Vector3 } from 'three';
import { inputManager, useInputAction } from './inputManager';

type FirstPersonControlsProps = {
  enabled?: boolean;
  movementSpeed?: number;
  lookSpeed?: number;
  lockOnClick?: boolean;
};

function roundVector(vector: Vector3) {
  return vector.toArray().map((value) => Number(value.toFixed(3)));
}

function roundEuler(euler: Euler) {
  return [euler.x, euler.y, euler.z].map((value) => Number(value.toFixed(3)));
}

export function FirstPersonControls({
  enabled = true,
  movementSpeed = 4,
  lookSpeed = 0.002,
  lockOnClick = false,
}: FirstPersonControlsProps) {
  const { camera, gl } = useThree();
  const isLocked = useRef(false);

  const vectors = useMemo(
    () => ({
      euler: new Euler(0, 0, 0, 'YXZ'),
      forward: new Vector3(),
      right: new Vector3(),
      move: new Vector3(),
    }),
    [],
  );

  const togglePointerLock = useCallback(() => {
    if (document.pointerLockElement === gl.domElement) {
      document.exitPointerLock();
      return;
    }

    void gl.domElement.requestPointerLock();
  }, [gl]);

  const printCameraSnapshot = useCallback(() => {
    const lookDirection = new Vector3();
    const lookAt = new Vector3();

    camera.getWorldDirection(lookDirection);
    lookAt.copy(camera.position).addScaledVector(lookDirection, 10);
    vectors.euler.setFromQuaternion(camera.quaternion);

    void fetch('/__editor-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: 'camera snapshot',
        position: roundVector(camera.position),
        rotation: roundEuler(vectors.euler),
        lookDirection: roundVector(lookDirection),
        lookAt10Units: roundVector(lookAt),
      }),
    });
  }, [camera, vectors]);

  useInputAction('unlockPointer', 'started', togglePointerLock);
  useInputAction('printCameraSnapshot', 'started', printCameraSnapshot);

  useEffect(() => {
    const canvas = gl.domElement;

    function handleClick() {
      if (!enabled || !lockOnClick || document.pointerLockElement === canvas) {
        return;
      }

      void canvas.requestPointerLock();
    }

    function handlePointerLockChange() {
      isLocked.current = document.pointerLockElement === canvas;

      if (!isLocked.current) {
        inputManager.clear();
      }
    }

    function handleMouseMove(event: MouseEvent) {
      if (!enabled || !isLocked.current) {
        return;
      }

      vectors.euler.setFromQuaternion(camera.quaternion);
      vectors.euler.y -= event.movementX * lookSpeed;
      vectors.euler.x -= event.movementY * lookSpeed;
      vectors.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, vectors.euler.x));
      camera.quaternion.setFromEuler(vectors.euler);
    }

    canvas.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, enabled, gl, lockOnClick, lookSpeed, vectors]);

  useEffect(() => {
    if (!enabled && document.pointerLockElement === gl.domElement) {
      document.exitPointerLock();
    }
  }, [enabled, gl]);

  useFrame((_, delta) => {
    if (!enabled || !isLocked.current) {
      return;
    }

    vectors.forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    vectors.forward.y = 0;
    vectors.forward.normalize();

    vectors.right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    vectors.right.y = 0;
    vectors.right.normalize();

    vectors.move.set(0, 0, 0);

    if (inputManager.isPressed('moveForward')) {
      vectors.move.add(vectors.forward);
    }

    if (inputManager.isPressed('moveBackward')) {
      vectors.move.sub(vectors.forward);
    }

    if (inputManager.isPressed('moveRight')) {
      vectors.move.add(vectors.right);
    }

    if (inputManager.isPressed('moveLeft')) {
      vectors.move.sub(vectors.right);
    }

    if (vectors.move.lengthSq() === 0) {
      return;
    }

    const speedMultiplier = inputManager.isPressed('sprint') ? 2 : 1;
    camera.position.addScaledVector(vectors.move.normalize(), movementSpeed * speedMultiplier * delta);
  });

  return null;
}

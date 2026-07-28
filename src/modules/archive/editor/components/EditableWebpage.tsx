import { Html, TransformControls } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';
import { useInputAction } from '../../input/inputManager';

type TransformMode = 'translate' | 'rotate' | 'scale';

export type EditableWebpageProps = {
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onTransformingChange: (isTransforming: boolean) => void;
  title: string;
  url: string;
};

const webpageWidth = 640;
const webpageHeight = 360;
const scaleMultiplier = 1.1;
const minWebpageScale = 0.001;
const rotationStep = 0.1;

function round(value: number) {
  return Number(value.toFixed(3));
}

function roundTuple(values: number[]) {
  return values.map(round);
}

function logWebpageTransform(group: Group) {
  void fetch('/__editor-log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      label: 'webpage',
      position: roundTuple(group.position.toArray()),
      rotation: roundTuple([group.rotation.x, group.rotation.y, group.rotation.z]),
      scale: roundTuple(group.scale.toArray()),
    }),
  });
}

function updateWebpageTransform(group: Group | null, update: (group: Group) => void) {
  if (!group) {
    return;
  }

  update(group);
  group.updateMatrixWorld();
  logWebpageTransform(group);
}

export function EditableWebpage({
  isSelected,
  onSelect,
  onDeselect,
  onTransformingChange,
  title,
  url,
}: EditableWebpageProps) {
  const groupRef = useRef<Group>(null);
  const [controlledGroup, setControlledGroup] = useState<Group | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');

  useEditableWebpageInputs({
    isSelected,
    groupRef,
    setTransformMode,
    onDeselect,
  });

  function handleGroupRef(group: Group | null) {
    groupRef.current = group;
    setControlledGroup(group);
  }

  function selectWebpage(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onSelect();
  }

  function handleTransformMouseUp() {
    onTransformingChange(false);

    if (!groupRef.current) {
      return;
    }

    logWebpageTransform(groupRef.current);
  }

  return (
    <>
      <group ref={handleGroupRef} position={[-1.35, 1.15, 1.15]} rotation={[0, -1.45, 0]} scale={0.006}>
        <mesh onClick={selectWebpage}>
          <planeGeometry args={[webpageWidth, webpageHeight]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <Html
          center
          transform
          position={[0, 0, 1]}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <iframe
            src={url}
            title={title}
            width={webpageWidth}
            height={webpageHeight}
            style={{
              width: webpageWidth,
              height: webpageHeight,
              border: '0',
              background: '#05070d',
            }}
          />
        </Html>
      </group>

      {controlledGroup && isSelected && (
        <TransformControls
          object={controlledGroup}
          mode={transformMode}
          onMouseDown={() => onTransformingChange(true)}
          onMouseUp={handleTransformMouseUp}
        />
      )}
    </>
  );
}

function useEditableWebpageInputs({
  isSelected,
  groupRef,
  setTransformMode,
  onDeselect,
}: {
  isSelected: boolean;
  groupRef: React.RefObject<Group | null>;
  setTransformMode: React.Dispatch<React.SetStateAction<TransformMode>>;
  onDeselect: () => void;
}) {
  useInputAction('deselectEditorObject', 'started', () => {
    onDeselect();
  }, isSelected);

  useInputAction('editorTranslate', 'started', () => {
    setTransformMode('translate');
  }, isSelected);

  useInputAction('editorRotate', 'started', () => {
    setTransformMode('rotate');
  }, isSelected);

  useInputAction('editorScale', 'started', () => {
    setTransformMode('scale');
  }, isSelected);

  useInputAction('webpageSizeIncrease', 'started', () => {
    updateWebpageTransform(groupRef.current, (group) => {
      group.scale.multiplyScalar(scaleMultiplier);
    });
  }, isSelected);

  useInputAction('webpageSizeDecrease', 'started', () => {
    updateWebpageTransform(groupRef.current, (group) => {
      const nextScale = Math.max(minWebpageScale, group.scale.x / scaleMultiplier);
      group.scale.setScalar(nextScale);
    });
  }, isSelected);

  useInputAction('webpageRotateY', 'started', () => {
    updateWebpageTransform(groupRef.current, (group) => {
      group.rotation.y += rotationStep;
    });
  }, isSelected);

  useInputAction('webpageRotateX', 'started', () => {
    updateWebpageTransform(groupRef.current, (group) => {
      group.rotation.x += rotationStep;
    });
  }, isSelected);
}

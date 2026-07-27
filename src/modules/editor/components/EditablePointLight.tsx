import { TransformControls } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';
import { useInputAction } from '../../input/inputManager';

export type EditablePointLightProps = {
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onTransformingChange: (isTransforming: boolean) => void;
};

const distanceStep = 5;
const intensityStep = 0.25;

function round(value: number) {
  return Number(value.toFixed(3));
}

export function EditablePointLight({
  isSelected,
  onSelect,
  onDeselect,
  onTransformingChange,
}: EditablePointLightProps) {
  const groupRef = useRef<Group>(null);

  const [controlledGroup, setControlledGroup] = useState<Group | null>(null);

  const [distance, setDistance] = useState(150);
  const [intensity, setIntensity] = useState(9);

  useEditablePointLightInputs({
    isSelected,
    distance,
    intensity,
    setDistance,
    setIntensity,
    onDeselect,
  });

  function handleGroupRef(group: Group | null) {
    groupRef.current = group;
    setControlledGroup(group);
  }

  function selectLight(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onSelect();
  }

  function handleTransformMouseUp() {
    onTransformingChange(false);

    if (!groupRef.current) return;

    const position = groupRef.current.position
      .toArray()
      .map((value) => Number(value.toFixed(3)));

    void fetch('/__editor-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: 'pointLight',
        position,
        distance: round(distance),
        intensity: round(intensity)
      }),
    });
  }

  return (
    <>
      <group ref={handleGroupRef} position={[.06, .2, 2]}>
        <pointLight intensity={intensity} distance={distance} decay={2} color="#ff2bd6" />

        <mesh raycast={() => null}>
          <sphereGeometry args={[distance, 32, 16]} />
          <meshBasicMaterial color="#ff2bd6" wireframe transparent opacity={0.18} />
        </mesh>

        <mesh onClick={selectLight}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={isSelected ? '#ffffff' : '#ff2bd6'} />
        </mesh>
      </group>

      {controlledGroup && isSelected && (
        <TransformControls
          object={controlledGroup}
          mode="translate"
          onMouseDown={() => onTransformingChange(true)}
          onMouseUp={handleTransformMouseUp}
        />
      )}
    </>
  );
}

function useEditablePointLightInputs({
  isSelected,
  distance,
  intensity,
  setDistance,
  setIntensity,
  onDeselect,
}: {
  isSelected: boolean;
  distance: number;
  intensity: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  setIntensity: React.Dispatch<React.SetStateAction<number>>;
  onDeselect: () => void;
}) {
  useInputAction('deselectEditorObject', 'started', () => {
    onDeselect();
  }, isSelected);

  useInputAction('lightDistanceIncrease', 'started', () => {
    setDistance((current) => current + 5);
  }, isSelected);

  useInputAction('lightDistanceDecrease', 'started', () => {
    setDistance((current) => Math.max(5, current - 5));
  }, isSelected);

  useInputAction('lightIntensityDecrease', 'started', () => {
    setIntensity((current) => Math.max(0, current - 0.25));
  }, isSelected);

  useInputAction('lightIntensityIncrease', 'started', () => {
    setIntensity((current) => current + 0.25);
  }, isSelected);
}

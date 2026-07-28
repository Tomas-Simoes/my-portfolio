import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from '../models/ModelViewer';
import type { SceneProps } from './sceneTypes';

export function Scene({ cameraPosition = [0, 1, 6] }: SceneProps) {
  return (
    <Canvas camera={{ position: cameraPosition, fov: 70 }}>
      <color attach="background" args={['#111827']} />

      <ambientLight intensity={0.1} />
      <directionalLight position={[4, 5, 3]} intensity={1.5} />

      <Suspense fallback={null}>
        <Model path="/models/arcade-bigger-scene.glb" />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}

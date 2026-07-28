import { useGLTF } from '@react-three/drei';
import type { ModelViewerProps } from './modelTypes';

export function Model({ path, position = [0, 0, 0], scale = 1 }: ModelViewerProps) {
    const gltf = useGLTF(path);

    return <primitive object={gltf.scene} position={position} scale={scale} />;
}

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Model } from '../models/ModelViewer';
import type { SceneProps } from './sceneEditorTypes';
import { EditablePointLight } from './components/EditablePointLight';
import { EditableWebpage } from './components/EditableWebpage';
import { FirstPersonControls } from '../input/FirstPersonControls';
import { InputListener, useInputAction } from '../input/inputManager';

type SelectedEditorObject = 'pointLight' | 'webpage' | null;

export function SceneEditor() {
    const [isTransforming, setIsTransforming] = useState(false);
    const [selectedEditorObject, setSelectedEditorObject] = useState<SelectedEditorObject>('pointLight');

    useInputAction('unlockPointer', 'started', () => {
        setIsTransforming(false);
        setSelectedEditorObject(null);
    });

    return (
        <Canvas camera={{ position: [-4.9, .5, 2.1], rotation: [0, -1.5, 0], lookAt: [.9, -.2, -.03], fov: 70 }}>
            <InputListener />
            <color attach="background" args={['#111827']} />

            {/*
            <ambientLight intensity={0.1} />
            <directionalLight position={[4, 5, 3]} intensity={1.5} />
            */}

            <EditablePointLight
                isSelected={selectedEditorObject === 'pointLight'}
                onSelect={() => setSelectedEditorObject('pointLight')}
                onDeselect={() => setSelectedEditorObject(null)}
                onTransformingChange={setIsTransforming}
            />

            <EditableWebpage
                isSelected={selectedEditorObject === 'webpage'}
                onSelect={() => setSelectedEditorObject('webpage')}
                onDeselect={() => setSelectedEditorObject(null)}
                onTransformingChange={setIsTransforming}
                title="Enter The Chamber"
                url="https://enterthechamber.vercel.app/?embed=1"
            />

            <Suspense fallback={null}>
                <Model path="/models/arcade-bigger-scene.glb" />
            </Suspense>

            <FirstPersonControls enabled={!isTransforming && selectedEditorObject === null} />
        </Canvas>
    );
}

import { useTexture } from "@react-three/drei";
import { useCallback, useEffect, useMemo } from "react";
import { Color, DoubleSide, RepeatWrapping } from "three";
import type { MeshStandardMaterial, Texture } from "three";
import { BOOT_SCENE_PALETTE } from "../lib/bootPalette";

type Vector3 = [number, number, number];
type FaceSize = [number, number];

export type MemoryBlock = {
  id: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
};

const FLOOR_Y = 1;
const TEXTURE_TILES_PER_UNIT = 0.45;
const BLOCK_FIELD_RADIUS = 10;
const BLOCK_COUNT = 20;
const BLOCK_SEPARATION_GAP = 0.6;
const CENTER_CLEARANCE_RADIUS = 3.2;
const POSITION_ATTEMPTS = 80;
const { memoryBlocks } = BOOT_SCENE_PALETTE;
const BLOCK_BASE_FOG_COLOR = new Color(memoryBlocks.baseFog);
const BLOCK_BASE_FOG_BOTTOM_Y = 2.2;
const BLOCK_BASE_FOG_TOP_Y = 8.6;

function getBlockFootprintRadius(scale: Vector3) {
  return Math.hypot(scale[0] / 2, scale[2] / 2);
}

function randomPositionCoordinate() {
  return Math.random() * BLOCK_FIELD_RADIUS * 2 - BLOCK_FIELD_RADIUS;
}

function positionClearsCenter(position: Vector3, scale: Vector3) {
  const minDistance = CENTER_CLEARANCE_RADIUS + getBlockFootprintRadius(scale);
  const [x, , z] = position;

  return x * x + z * z >= minDistance * minDistance;
}

function createBlockPosition(scale: Vector3): Vector3 {
  for (let attempt = 0; attempt < POSITION_ATTEMPTS; attempt++) {
    const position: Vector3 = [
      randomPositionCoordinate(),
      FLOOR_Y,
      randomPositionCoordinate(),
    ];

    if (positionClearsCenter(position, scale)) {
      return position;
    }
  }

  const minDistance = CENTER_CLEARANCE_RADIUS + getBlockFootprintRadius(scale);
  const distance = minDistance + Math.random() * Math.max(0, BLOCK_FIELD_RADIUS - minDistance);
  const angle = Math.random() * Math.PI * 2;

  return [
    Math.cos(angle) * distance,
    FLOOR_Y,
    Math.sin(angle) * distance,
  ];
}

function pushBlockOutOfCenter(block: MemoryBlock) {
  const minDistance =
    CENTER_CLEARANCE_RADIUS + getBlockFootprintRadius(block.scale) + BLOCK_SEPARATION_GAP;
  const x = block.position[0];
  const z = block.position[2];
  const distance = Math.hypot(x, z);

  if (distance >= minDistance) {
    return;
  }

  if (distance === 0) {
    block.position[0] = minDistance;
    block.position[2] = 0;

    return;
  }

  const pushScale = minDistance / distance;

  block.position[0] = x * pushScale;
  block.position[2] = z * pushScale;
}

function keepCenterClear(blocks: MemoryBlock[]) {
  blocks.forEach(pushBlockOutOfCenter);
}

function separateBlocks(blocks: MemoryBlock[]) {
  keepCenterClear(blocks);

  for (let pass = 0; pass < 40; pass++) {
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i];
        const b = blocks[j];

        const minXDistance = a.scale[0] / 2 + b.scale[0] / 2 + BLOCK_SEPARATION_GAP;
        const minZDistance = a.scale[2] / 2 + b.scale[2] / 2 + BLOCK_SEPARATION_GAP;

        const dx = b.position[0] - a.position[0];
        const dz = b.position[2] - a.position[2];

        const overlapX = minXDistance - Math.abs(dx);
        const overlapZ = minZDistance - Math.abs(dz);

        if (overlapX > 0 && overlapZ > 0) {
          if (overlapX < overlapZ) {
            const push = overlapX / 2;
            const direction = dx >= 0 ? 1 : -1;

            a.position[0] -= push * direction;
            b.position[0] += push * direction;
          } else {
            const push = overlapZ / 2;
            const direction = dz >= 0 ? 1 : -1;

            a.position[2] -= push * direction;
            b.position[2] += push * direction;
          }

          pushBlockOutOfCenter(a);
          pushBlockOutOfCenter(b);
        }
      }
    }

    keepCenterClear(blocks);
  }

  return blocks;
}

export function createMemoryBlocks(): MemoryBlock[] {
  const blocks: MemoryBlock[] = [];

  for (let i = 0; i < BLOCK_COUNT; i++) {
    const scale: Vector3 = [
      2,
      Math.random() * 25 + 15,
      2,
    ];

    blocks.push({
      id: `block-${i}`,
      position: createBlockPosition(scale),
      rotation: [0, 0, 0],
      scale,
    });
  }

  return separateBlocks(blocks);
}

type BlockFaceProps = {
  position: Vector3;
  rotation: Vector3;
  size: FaceSize;
  texture: Texture;
  tint: string;
};

type BlockFaceMaterialProps = {
  texture: Texture;
  tint: string;
};

function BlockFaceMaterial({ texture, tint }: BlockFaceMaterialProps) {
  const applyBaseFog = useCallback((shader: Parameters<MeshStandardMaterial["onBeforeCompile"]>[0]) => {
    shader.uniforms.uBlockBaseFogColor = { value: BLOCK_BASE_FOG_COLOR };
    shader.uniforms.uBlockBaseFogBottomY = { value: BLOCK_BASE_FOG_BOTTOM_Y };
    shader.uniforms.uBlockBaseFogTopY = { value: BLOCK_BASE_FOG_TOP_Y };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        [
          "#include <common>",
          "varying float vBlockWorldY;",
        ].join("\n"),
      )
      .replace(
        "#include <worldpos_vertex>",
        [
          "#include <worldpos_vertex>",
          "vBlockWorldY = (modelMatrix * vec4(transformed, 1.0)).y;",
        ].join("\n"),
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        [
          "#include <common>",
          "uniform vec3 uBlockBaseFogColor;",
          "uniform float uBlockBaseFogBottomY;",
          "uniform float uBlockBaseFogTopY;",
          "varying float vBlockWorldY;",
        ].join("\n"),
      )
      .replace(
        "#include <fog_fragment>",
        [
          "#include <fog_fragment>",
          "float blockBaseFog = 1.0 - smoothstep(uBlockBaseFogBottomY, uBlockBaseFogTopY, vBlockWorldY);",
          "gl_FragColor.rgb = mix(gl_FragColor.rgb, uBlockBaseFogColor, blockBaseFog);",
        ].join("\n"),
      );
  }, []);

  return (
    <meshStandardMaterial
      map={texture}
      color={tint}
      emissive={memoryBlocks.emissive}
      emissiveIntensity={0.012}
      metalness={0.02}
      roughness={0.68}
      side={DoubleSide}
      onBeforeCompile={applyBaseFog}
    />
  );
}

function BlockFace({ position, rotation, size, texture, tint }: BlockFaceProps) {
  const faceTexture = useMemo(() => {
    const nextTexture = texture.clone();
    const repeat = [
      Math.max(1, size[0] * TEXTURE_TILES_PER_UNIT),
      Math.max(1, size[1] * TEXTURE_TILES_PER_UNIT),
    ];

    nextTexture.wrapS = RepeatWrapping;
    nextTexture.wrapT = RepeatWrapping;
    nextTexture.repeat.set(repeat[0], repeat[1]);
    nextTexture.needsUpdate = true;

    return nextTexture;
  }, [size[0], size[1], texture]);

  useEffect(() => {
    return () => faceTexture.dispose();
  }, [faceTexture]);

  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <BlockFaceMaterial texture={faceTexture} tint={tint} />
    </mesh>
  );
}

type MemoryBlockMeshProps = {
  block: MemoryBlock;
  texture: Texture;
};

function MemoryBlockMesh({ block, texture }: MemoryBlockMeshProps) {
  const [width, height, depth] = block.scale;

  return (
    <group position={block.position} rotation={block.rotation}>
      <BlockFace
        position={[0, height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[width, depth]}
        texture={texture}
        tint={memoryBlocks.top}
      />
      <BlockFace
        position={[0, -height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[width, depth]}
        texture={texture}
        tint={memoryBlocks.bottom}
      />
      <BlockFace
        position={[0, 0, depth / 2]}
        rotation={[0, 0, 0]}
        size={[width, height]}
        texture={texture}
        tint={memoryBlocks.front}
      />
      <BlockFace
        position={[0, 0, -depth / 2]}
        rotation={[0, Math.PI, 0]}
        size={[width, height]}
        texture={texture}
        tint={memoryBlocks.back}
      />
      <BlockFace
        position={[width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[depth, height]}
        texture={texture}
        tint={memoryBlocks.right}
      />
      <BlockFace
        position={[-width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[depth, height]}
        texture={texture}
        tint={memoryBlocks.left}
      />
    </group>
  );
}

type MemoryBlocksProps = {
  blocks?: MemoryBlock[];
};

export function MemoryBlocks({ blocks: providedBlocks }: MemoryBlocksProps) {
  const generatedBlocks = useMemo(createMemoryBlocks, []);
  const blocks = providedBlocks ?? generatedBlocks;
  const texture = useTexture('/images/texture/concrete.jpg');

  return (
    <group>
      {blocks.map((block) => (
        <MemoryBlockMesh
          key={block.id}
          block={block}
          texture={texture}
        />
      ))}
    </group>
  );
}

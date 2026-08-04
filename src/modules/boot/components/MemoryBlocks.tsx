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
const BLOCK_BASE_FOG_BOTTOM_Y = 6.8;
const BLOCK_BASE_FOG_TOP_Y = 15.8;
const BLOCK_BASE_VOID_BOTTOM_Y = 4.8;
const BLOCK_BASE_VOID_TOP_Y = 12.8;
const BLOCK_DISTANCE_FOG_NEAR = 11;
const BLOCK_DISTANCE_FOG_FAR = 24;
const BLOCK_DISTANCE_VOID_NEAR = 16;
const BLOCK_DISTANCE_VOID_FAR = 27;
const MOBILE_BLOCK_COUNT = 14;
const MOBILE_BLOCK_FIELD_RADIUS = 8.8;
const MOBILE_BLOCK_CENTER_CLEARANCE_RADIUS = 2.05;
const MOBILE_BLOCK_SEPARATION_GAP = 0.42;
const MOBILE_BLOCK_WIDTH_MIN = 1.18;
const MOBILE_BLOCK_WIDTH_MAX = 1.68;
const MOBILE_BLOCK_HEIGHT_MIN = 11;
const MOBILE_BLOCK_HEIGHT_MAX = 24;
const MOBILE_POSITION_ATTEMPTS = 120;
const MOBILE_BLOCK_BASE_FOG_BOTTOM_Y = 3.8;
const MOBILE_BLOCK_BASE_FOG_TOP_Y = 13.8;
const MOBILE_BLOCK_BASE_VOID_BOTTOM_Y = 2.6;
const MOBILE_BLOCK_BASE_VOID_TOP_Y = 8.8;
const MOBILE_BLOCK_DISTANCE_FOG_NEAR = 26;
const MOBILE_BLOCK_DISTANCE_FOG_FAR = 58;
const MOBILE_BLOCK_DISTANCE_VOID_NEAR = 42;
const MOBILE_BLOCK_DISTANCE_VOID_FAR = 70;

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getBlockFootprintRadius(scale: Vector3) {
  return Math.hypot(scale[0] / 2, scale[2] / 2);
}

function randomPositionCoordinate(fieldRadius = BLOCK_FIELD_RADIUS) {
  return Math.random() * fieldRadius * 2 - fieldRadius;
}

function positionClearsCenter(
  position: Vector3,
  scale: Vector3,
  centerClearanceRadius = CENTER_CLEARANCE_RADIUS,
) {
  const minDistance = centerClearanceRadius + getBlockFootprintRadius(scale);
  const [x, , z] = position;

  return x * x + z * z >= minDistance * minDistance;
}

function createBlockPosition(
  scale: Vector3,
  fieldRadius = BLOCK_FIELD_RADIUS,
  centerClearanceRadius = CENTER_CLEARANCE_RADIUS,
): Vector3 {
  for (let attempt = 0; attempt < POSITION_ATTEMPTS; attempt++) {
    const position: Vector3 = [
      randomPositionCoordinate(fieldRadius),
      FLOOR_Y,
      randomPositionCoordinate(fieldRadius),
    ];

    if (positionClearsCenter(position, scale, centerClearanceRadius)) {
      return position;
    }
  }

  const minDistance = centerClearanceRadius + getBlockFootprintRadius(scale);
  const distance = minDistance + Math.random() * Math.max(0, fieldRadius - minDistance);
  const angle = Math.random() * Math.PI * 2;

  return [
    Math.cos(angle) * distance,
    FLOOR_Y,
    Math.sin(angle) * distance,
  ];
}

function createMobileBlockPosition(scale: Vector3): Vector3 {
  const minDistance = MOBILE_BLOCK_CENTER_CLEARANCE_RADIUS + getBlockFootprintRadius(scale);

  for (let attempt = 0; attempt < MOBILE_POSITION_ATTEMPTS; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    const distance =
      minDistance +
      Math.pow(Math.random(), 1.45) * Math.max(0, MOBILE_BLOCK_FIELD_RADIUS - minDistance);
    const position: Vector3 = [
      Math.cos(angle) * distance,
      FLOOR_Y,
      Math.sin(angle) * distance,
    ];

    if (positionClearsCenter(position, scale, MOBILE_BLOCK_CENTER_CLEARANCE_RADIUS)) {
      return position;
    }
  }

  const angle = Math.random() * Math.PI * 2;

  return [
    Math.cos(angle) * minDistance,
    FLOOR_Y,
    Math.sin(angle) * minDistance,
  ];
}

function pushBlockOutOfCenter(
  block: MemoryBlock,
  centerClearanceRadius = CENTER_CLEARANCE_RADIUS,
  separationGap = BLOCK_SEPARATION_GAP,
) {
  const minDistance =
    centerClearanceRadius + getBlockFootprintRadius(block.scale) + separationGap;
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

function keepCenterClear(
  blocks: MemoryBlock[],
  centerClearanceRadius = CENTER_CLEARANCE_RADIUS,
  separationGap = BLOCK_SEPARATION_GAP,
) {
  blocks.forEach((block) => pushBlockOutOfCenter(block, centerClearanceRadius, separationGap));
}

function separateBlocks(
  blocks: MemoryBlock[],
  centerClearanceRadius = CENTER_CLEARANCE_RADIUS,
  separationGap = BLOCK_SEPARATION_GAP,
) {
  keepCenterClear(blocks, centerClearanceRadius, separationGap);

  for (let pass = 0; pass < 40; pass++) {
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i];
        const b = blocks[j];

        const minXDistance = a.scale[0] / 2 + b.scale[0] / 2 + separationGap;
        const minZDistance = a.scale[2] / 2 + b.scale[2] / 2 + separationGap;

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

          pushBlockOutOfCenter(a, centerClearanceRadius, separationGap);
          pushBlockOutOfCenter(b, centerClearanceRadius, separationGap);
        }
      }
    }

    keepCenterClear(blocks, centerClearanceRadius, separationGap);
  }

  return blocks;
}

export function createMemoryBlocks(blockCount = BLOCK_COUNT): MemoryBlock[] {
  const blocks: MemoryBlock[] = [];

  for (let i = 0; i < blockCount; i++) {
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

export function createMobileMemoryBlocks(): MemoryBlock[] {
  const blocks: MemoryBlock[] = [];

  for (let i = 0; i < MOBILE_BLOCK_COUNT; i++) {
    const width = randomRange(MOBILE_BLOCK_WIDTH_MIN, MOBILE_BLOCK_WIDTH_MAX);
    const scale: Vector3 = [
      width,
      randomRange(MOBILE_BLOCK_HEIGHT_MIN, MOBILE_BLOCK_HEIGHT_MAX),
      width,
    ];

    blocks.push({
      id: `mobile-block-${i}`,
      position: createMobileBlockPosition(scale),
      rotation: [0, 0, 0],
      scale,
    });
  }

  return separateBlocks(
    blocks,
    MOBILE_BLOCK_CENTER_CLEARANCE_RADIUS,
    MOBILE_BLOCK_SEPARATION_GAP,
  );
}

type BlockFaceProps = {
  position: Vector3;
  rotation: Vector3;
  size: FaceSize;
  texture: Texture;
  tint: string;
  colorBoost?: boolean;
};

type BlockFaceMaterialProps = {
  texture: Texture;
  tint: string;
  colorBoost?: boolean;
};

function BlockFaceMaterial({ texture, tint, colorBoost = false }: BlockFaceMaterialProps) {
  const applyBaseFog = useCallback((shader: Parameters<MeshStandardMaterial["onBeforeCompile"]>[0]) => {
    shader.uniforms.uBlockBaseFogColor = { value: BLOCK_BASE_FOG_COLOR };
    shader.uniforms.uBlockBaseFogBottomY = {
      value: colorBoost ? MOBILE_BLOCK_BASE_FOG_BOTTOM_Y : BLOCK_BASE_FOG_BOTTOM_Y,
    };
    shader.uniforms.uBlockBaseFogTopY = {
      value: colorBoost ? MOBILE_BLOCK_BASE_FOG_TOP_Y : BLOCK_BASE_FOG_TOP_Y,
    };
    shader.uniforms.uBlockBaseVoidBottomY = {
      value: colorBoost ? MOBILE_BLOCK_BASE_VOID_BOTTOM_Y : BLOCK_BASE_VOID_BOTTOM_Y,
    };
    shader.uniforms.uBlockBaseVoidTopY = {
      value: colorBoost ? MOBILE_BLOCK_BASE_VOID_TOP_Y : BLOCK_BASE_VOID_TOP_Y,
    };
    shader.uniforms.uBlockDistanceFogNear = {
      value: colorBoost ? MOBILE_BLOCK_DISTANCE_FOG_NEAR : BLOCK_DISTANCE_FOG_NEAR,
    };
    shader.uniforms.uBlockDistanceFogFar = {
      value: colorBoost ? MOBILE_BLOCK_DISTANCE_FOG_FAR : BLOCK_DISTANCE_FOG_FAR,
    };
    shader.uniforms.uBlockDistanceVoidNear = {
      value: colorBoost ? MOBILE_BLOCK_DISTANCE_VOID_NEAR : BLOCK_DISTANCE_VOID_NEAR,
    };
    shader.uniforms.uBlockDistanceVoidFar = {
      value: colorBoost ? MOBILE_BLOCK_DISTANCE_VOID_FAR : BLOCK_DISTANCE_VOID_FAR,
    };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        [
          "#include <common>",
          "varying float vBlockWorldY;",
          "varying float vBlockViewDepth;",
        ].join("\n"),
      )
      .replace(
        "#include <worldpos_vertex>",
        [
          "#include <worldpos_vertex>",
          "vBlockWorldY = (modelMatrix * vec4(transformed, 1.0)).y;",
        ].join("\n"),
      )
      .replace(
        "#include <project_vertex>",
        [
          "#include <project_vertex>",
          "vBlockViewDepth = -mvPosition.z;",
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
          "uniform float uBlockBaseVoidBottomY;",
          "uniform float uBlockBaseVoidTopY;",
          "uniform float uBlockDistanceFogNear;",
          "uniform float uBlockDistanceFogFar;",
          "uniform float uBlockDistanceVoidNear;",
          "uniform float uBlockDistanceVoidFar;",
          "varying float vBlockWorldY;",
          "varying float vBlockViewDepth;",
        ].join("\n"),
      )
      .replace(
        "#include <fog_fragment>",
        [
          "#include <fog_fragment>",
          "float blockBaseFog = 1.0 - smoothstep(uBlockBaseFogBottomY, uBlockBaseFogTopY, vBlockWorldY);",
          "float blockDistanceFog = smoothstep(uBlockDistanceFogNear, uBlockDistanceFogFar, vBlockViewDepth);",
          "float blockBaseVisibility = smoothstep(uBlockBaseVoidBottomY, uBlockBaseVoidTopY, vBlockWorldY);",
          "float blockDistanceVisibility = 1.0 - smoothstep(uBlockDistanceVoidNear, uBlockDistanceVoidFar, vBlockViewDepth);",
          "float blockVoidFog = max(blockBaseFog, blockDistanceFog);",
          "float blockVisibility = min(blockBaseVisibility, blockDistanceVisibility);",
          "gl_FragColor.rgb = mix(gl_FragColor.rgb, uBlockBaseFogColor, blockVoidFog);",
          "gl_FragColor.a *= blockVisibility;",
          "if (gl_FragColor.a < 0.015) discard;",
        ].join("\n"),
      );
  }, [colorBoost]);

  return (
    <meshStandardMaterial
      map={texture}
      color={tint}
      emissive={memoryBlocks.emissive}
      emissiveIntensity={colorBoost ? 0.055 : 0.012}
      metalness={0.02}
      roughness={colorBoost ? 0.5 : 0.68}
      side={DoubleSide}
      transparent
      onBeforeCompile={applyBaseFog}
    />
  );
}

function BlockFace({ position, rotation, size, texture, tint, colorBoost = false }: BlockFaceProps) {
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
      <BlockFaceMaterial texture={faceTexture} tint={tint} colorBoost={colorBoost} />
    </mesh>
  );
}

type MemoryBlockMeshProps = {
  block: MemoryBlock;
  texture: Texture;
  colorBoost?: boolean;
};

function MemoryBlockMesh({ block, texture, colorBoost = false }: MemoryBlockMeshProps) {
  const [width, height, depth] = block.scale;

  return (
    <group position={block.position} rotation={block.rotation}>
      <BlockFace
        position={[0, height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[width, depth]}
        texture={texture}
        tint={memoryBlocks.top}
        colorBoost={colorBoost}
      />
      <BlockFace
        position={[0, -height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[width, depth]}
        texture={texture}
        tint={memoryBlocks.bottom}
        colorBoost={colorBoost}
      />
      <BlockFace
        position={[0, 0, depth / 2]}
        rotation={[0, 0, 0]}
        size={[width, height]}
        texture={texture}
        tint={memoryBlocks.front}
        colorBoost={colorBoost}
      />
      <BlockFace
        position={[0, 0, -depth / 2]}
        rotation={[0, Math.PI, 0]}
        size={[width, height]}
        texture={texture}
        tint={memoryBlocks.back}
        colorBoost={colorBoost}
      />
      <BlockFace
        position={[width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[depth, height]}
        texture={texture}
        tint={memoryBlocks.right}
        colorBoost={colorBoost}
      />
      <BlockFace
        position={[-width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[depth, height]}
        texture={texture}
        tint={memoryBlocks.left}
        colorBoost={colorBoost}
      />
    </group>
  );
}

type MemoryBlocksProps = {
  blocks?: MemoryBlock[];
  colorBoost?: boolean;
};

export function MemoryBlocks({ blocks: providedBlocks, colorBoost = false }: MemoryBlocksProps) {
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
          colorBoost={colorBoost}
        />
      ))}
    </group>
  );
}

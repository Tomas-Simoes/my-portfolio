import { useEffect, useMemo } from "react";
import { AdditiveBlending, CanvasTexture, NormalBlending, SRGBColorSpace } from "three";
import type { Texture } from "three";

type Vector3 = [number, number, number];

type FogComponent = {
  id: string;
  position: Vector3;
  scale: Vector3;
  color: string;
  opacity: number;
  rotation: number;
  blendMode?: "glow" | "shadow";
};

const FOG_COMPONENTS: FogComponent[] = [
  {
    id: "ember-left",
    position: [-5.5, 7.2, 5.2],
    scale: [22, 8.4, 1],
    color: "#ff6a1d",
    opacity: 0.18,
    rotation: -0.42,
  },
  {
    id: "cobalt-right",
    position: [5.8, 8.6, -4.6],
    scale: [20, 9.2, 1],
    color: "#225cff",
    opacity: 0.17,
    rotation: 0.36,
  },
  {
    id: "hot-center",
    position: [1.3, 6.5, 1.4],
    scale: [18, 8.8, 1],
    color: "#ff3d12",
    opacity: 0.08,
    rotation: 0.12,
  },
  {
    id: "cyan-lift",
    position: [-4.8, 9.8, -5.6],
    scale: [16, 7.4, 1],
    color: "#00d9ff",
    opacity: 0.11,
    rotation: -0.08,
  },
  {
    id: "violet-roof",
    position: [2.4, 10.4, 4.8],
    scale: [18, 9, 1],
    color: "#7d35ff",
    opacity: 0.09,
    rotation: 0.7,
  },
  {
    id: "black-pocket",
    position: [0.4, 5.6, -0.2],
    scale: [27, 14.8, 1],
    color: "#020007",
    opacity: 0.3,
    rotation: -0.2,
    blendMode: "shadow",
  },
  {
    id: "lower-shadow",
    position: [-1.6, 4.8, 5.8],
    scale: [20, 9.8, 1],
    color: "#000000",
    opacity: 0.2,
    rotation: 0.38,
    blendMode: "shadow",
  },
];

function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;

    return value / 4294967296;
  };
}

function createFogTexture() {
  const canvas = document.createElement("canvas");
  const size = 256;
  const context = canvas.getContext("2d");
  const random = createSeededRandom(48193);

  canvas.width = size;
  canvas.height = size;

  if (!context) {
    return new CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 0.48)");
  gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.25)");
  gradient.addColorStop(0.62, "rgba(255, 255, 255, 0.08)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.filter = "blur(4px)";

  for (let i = 0; i < 46; i++) {
    const x = (0.16 + random() * 0.68) * size;
    const y = (0.2 + random() * 0.58) * size;
    const radius = (0.06 + random() * 0.18) * size;
    const opacity = 0.04 + random() * 0.16;
    const puffGradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);

    puffGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    puffGradient.addColorStop(0.55, `rgba(255, 255, 255, ${opacity * 0.32})`);
    puffGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.save();
    context.translate(x, y);
    context.rotate((random() - 0.5) * Math.PI);
    context.scale(1.35 + random() * 1.6, 0.42 + random() * 0.58);
    context.fillStyle = puffGradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  context.globalCompositeOperation = "destination-out";

  for (let i = 0; i < 18; i++) {
    const x = (0.12 + random() * 0.76) * size;
    const y = (0.12 + random() * 0.76) * size;
    const radius = (0.05 + random() * 0.15) * size;
    const holeGradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);

    holeGradient.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    holeGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.save();
    context.translate(x, y);
    context.scale(1.9, 0.72);
    context.fillStyle = holeGradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  context.filter = "none";
  context.globalCompositeOperation = "destination-in";
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  context.globalCompositeOperation = "source-over";

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;

  return texture;
}

export function MemoryFog() {
  const texture = useMemo(createFogTexture, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <group>
      {FOG_COMPONENTS.map((component) => (
        <sprite key={component.id} position={component.position} scale={component.scale}>
          <spriteMaterial
            map={texture}
            color={component.color}
            transparent
            opacity={component.opacity}
            blending={component.blendMode === "shadow" ? NormalBlending : AdditiveBlending}
            rotation={component.rotation}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}

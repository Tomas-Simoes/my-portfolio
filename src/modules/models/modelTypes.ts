import type { Vector3 } from 'three';

export type ModelViewerProps = {
  path: string;
  position?: Vector3 | [number, number, number];
  scale?: number | [number, number, number];
};

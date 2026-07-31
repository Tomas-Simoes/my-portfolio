import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Vector2, Vector3 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BOOT_SCENE_PALETTE } from '../lib/bootPalette';

const { postGrade } = BOOT_SCENE_PALETTE;

const ATMOSPHERE_GRADE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    warmGrade: { value: new Vector3(...postGrade.warmGrade) },
    coolGrade: { value: new Vector3(...postGrade.coolGrade) },
    gradeMix: { value: postGrade.gradeMix },
    emberHazeColor: { value: new Vector3(...postGrade.emberHazeColor) },
    emberHazeStrength: { value: postGrade.emberHazeStrength },
    cobaltHazeColor: { value: new Vector3(...postGrade.cobaltHazeColor) },
    cobaltHazeStrength: { value: postGrade.cobaltHazeStrength },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec3 warmGrade;
    uniform vec3 coolGrade;
    uniform float gradeMix;
    uniform vec3 emberHazeColor;
    uniform float emberHazeStrength;
    uniform vec3 cobaltHazeColor;
    uniform float cobaltHazeStrength;
    varying vec2 vUv;

    float random(vec2 point) {
      return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec2 centerDelta = uv - vec2(0.5);
      float edgeDistance = length(centerDelta);
      vec2 colorFringe = centerDelta * edgeDistance * 0.004;

      vec4 color = texture2D(tDiffuse, uv);
      color.r = texture2D(tDiffuse, uv + colorFringe).r;
      color.b = texture2D(tDiffuse, uv - colorFringe).b;

      float coolSide = smoothstep(0.0, 1.0, uv.x * 0.72 + uv.y * 0.28);
      color.rgb = mix(color.rgb, color.rgb * mix(warmGrade, coolGrade, coolSide), gradeMix);

      float emberHaze = smoothstep(0.72, 0.08, length((uv - vec2(0.62, 0.56)) * vec2(1.8, 1.05)));
      float cobaltHaze = smoothstep(0.82, 0.1, length((uv - vec2(0.41, 0.46)) * vec2(1.25, 1.55)));
      color.rgb += emberHazeColor * emberHaze * emberHazeStrength;
      color.rgb += cobaltHazeColor * cobaltHaze * cobaltHazeStrength;

      float vignette = smoothstep(0.86, 0.22, edgeDistance);
      color.rgb *= mix(0.3, 1.03, vignette);

      float grain = random(uv * vec2(1537.0, 911.0) + time * 0.19);
      color.rgb += (grain - 0.5) * 0.004;

      gl_FragColor = vec4(max(color.rgb, vec3(0.0)), color.a);
    }
  `,
};

export function BootPostEffects() {
  const { camera, gl, scene, size } = useThree();
  const { bloomPass, composer, gradePass } = useMemo(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new Vector2(size.width, size.height), 0.34, 0.52, 0.55);
    const gradePass = new ShaderPass(ATMOSPHERE_GRADE_SHADER);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(gradePass);
    composer.addPass(new OutputPass());

    return { bloomPass, composer, gradePass };
  }, [camera, gl, scene, size.height, size.width]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
    bloomPass.setSize(size.width, size.height);
  }, [bloomPass, composer, gl, size.height, size.width]);

  useEffect(() => {
    return () => composer.dispose();
  }, [composer]);

  useFrame(({ clock }, delta) => {
    gradePass.uniforms.time.value = clock.elapsedTime;
    composer.render(delta);
  }, 1);

  return null;
}

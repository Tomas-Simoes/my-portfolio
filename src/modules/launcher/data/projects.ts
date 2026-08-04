export type ProjectTheme = {
  accent: string;
  accentStrong: string;
  accentRgb: string;
  background: string;
  backgroundRgb: string;
  surface: string;
  surfaceRgb: string;
  textMain: string;
  textMuted: string;
  textRgb: string;
};

export type ProjectMedia = {
  src: string;
  type: 'image' | 'video';
};

export type Project = {
  id: string;
  title: string;
  detail: string;
  summary: string;
  description: string;
  contribution: string;
  category: string;
  builtSections: {
    title: string;
    detail: string;
  }[];
  stack: string[];
  year: string;
  timelineLabel: string;
  role: string;
  buildMeta: string;
  links: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }[];
  cover: string;
  coverImage?: string;
  previewMedia?: ProjectMedia[];
  theme: ProjectTheme;
};

export const projects: Project[] = [
  {
    id: 'aspect-of-light',
    title: 'Aspect of Light',
    detail: 'Souls-like prototype in Unity',
    summary:
      'A prototype of a top-down souls-like centred around exploration and challenging boss encounters.',
    description:
      'Developed in 2023 as the final project of my vocational course, Aspect of Light is a playable top-down designed to bring the difficult of a souls-like into a 2D world.',
    contribution:
      'Designed and developed the project leading a team of 2 developers, taking it from its initial concept to a complete playable prototype with a modular architecture that could support a larger game.',
    category: 'Game',
    builtSections: [
      {
        title: 'Combat & Enemies',
        detail: 'Player combat, enemy behaviour and the complete boss encounter.',
      },
      {
        title: 'Ability Progression',
        detail: 'An ability progression system with skill tree.',
      },
      {
        title: 'World Systems',
        detail: 'NPC dialogue, camera management and 2 explorable areas.',
      },
    ],
    stack: ['Unity', 'C#', 'Game Architecture'],
    year: '2023',
    timelineLabel: 'Year',
    role: 'Lead Developer',
    buildMeta: 'Published July 2023',
    links: [
      {
        label: '▶ INSTALL',
        href: 'https://github.com/Tomas-Simoes/Aspect-of-Light',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #050b08, #122a1d 48%, #7ee787)',
    coverImage: '/images/projects/aspect-of-light/cover.png',
    previewMedia: [
      {
        src: '/images/projects/aspect-of-light/00.mp4',
        type: 'video',
      },
      {
        src: '/images/projects/aspect-of-light/01.png',
        type: 'image',
      },
      {
        src: '/images/projects/aspect-of-light/02.png',
        type: 'image',
      },
      {
        src: '/images/projects/aspect-of-light/03.png',
        type: 'image',
      },
    ],
    theme: {
      accent: '#7ee787',
      accentStrong: '#b7f58c',
      accentRgb: '126 231 135',
      background: '#06100b',
      backgroundRgb: '6 16 11',
      surface: '#111d17',
      surfaceRgb: '17 29 23',
      textMain: '#eef8ec',
      textMuted: '#9cb1a3',
      textRgb: '238 248 236',
    },
  },
  {
    id: 'acharya-measurement',
    title: 'Acharya Measurement',
    detail: 'Machine learning',
    summary:
      'A computer-vision prototype for estimating indoor wall and window dimensions from photographs.',
    description:
      'Developed during my internship at FamousGadget, the prototype explored how a single indoor photograph could be transformed into useful architectural measurements without requiring specialised scanning equipment.',
    contribution:
      'Implemented and evaluated the prototype’s end-to-end measurement approach, combining computer vision with geometric reasoning.',
    category: 'Computer Vision',
    builtSections: [
      {
        title: 'Detection Pipeline',
        detail: 'Image-processing flow for identifying reference points, windows and wall features.',
      },
      {
        title: 'Geometric Measurement',
        detail: 'Estimating real-world dimensions using detected reference points and camera information.',
      },
      {
        title: 'Research Output',
        detail: 'Structured experiments, evaluated measurement accuracy and contributed results used in the published paper.',
      },
    ],
    stack: ['Python', 'Ultralytics', 'YOLO'],
    year: '2023',
    timelineLabel: 'Paper',
    role: 'Intern',
    buildMeta: 'Published in 2023',
    links: [
      {
        label: '▶ VIEW PROJECT',
        href: 'https://github.com/Tomas-Simoes/Acharya-Measure-Prototype',
        variant: 'primary',
      },
      {
        label: 'Read paper ↗',
        href: 'https://www.mdpi.com/1424-8220/25/21/6744',
        variant: 'secondary',
      },
    ],
    cover: 'linear-gradient(135deg, #090b0d, #24282c 52%, #f7f8f2)',
    coverImage: '/images/projects/acharya/cover.png',
    previewMedia: [
      {
        src: '/images/projects/acharya/00.jpg',
        type: 'image',
      },
      {
        src: '/images/projects/acharya/01.jpg',
        type: 'image',
      },
      {
        src: '/images/projects/acharya/02.jpg',
        type: 'image',
      },
      {
        src: '/images/projects/acharya/03.jpg',
        type: 'image',
      },
    ],
    theme: {
      accent: '#f7f8f2',
      accentStrong: '#ffffff',
      accentRgb: '247 248 242',
      background: '#0b0d0f',
      backgroundRgb: '11 13 15',
      surface: '#181b1f',
      surfaceRgb: '24 27 31',
      textMain: '#f3f4ee',
      textMuted: '#a8adb1',
      textRgb: '243 244 238',
    },
  },
  {
    id: 'ninf-application',
    title: 'NINF Application',
    detail: 'Student association app · UBI',
    summary:
      'A student association app for course information, event engagement and a point-based reward system.',
    description:
      'Application for the NINF student association at UBI, created to centralise academic resources and encourage student participation in association activities.',
    contribution:
      'Led the frontend development and worked closely with the backend team to define API contracts and integration requirements.',
    category: 'App',
    builtSections: [
      {
        title: 'Academic Hub',
        detail: 'Centralised access to association and academic information.',
      },

      {
        title: 'Events & Rewards',
        detail: 'Attendance registration in events gives points which can be traded for rewards.',
      },
      {
        title: 'Mobile Architecture',
        detail: 'React Native architecture which enables both mobile and web versions.',
      },],
    stack: ['Expo', 'React Native', 'Backend API'],
    year: '2026',
    timelineLabel: 'Year',
    role: 'Lead Developer',
    buildMeta: "Backend services currently offline · Still haven't been published",
    links: [
      {
        label: '▶ OPEN PROJECT',
        href: 'https://app.ninf.org/home',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #06111c, #173150 52%, #b8ecff)',
    coverImage: '/images/projects/ninf/cover.png',
    previewMedia: [
      {
        src: '/images/projects/ninf/00.png',
        type: 'image',
      },
      {
        src: '/images/projects/ninf/01.png',
        type: 'image',
      },
      {
        src: '/images/projects/ninf/02.png',
        type: 'image',
      },
      {
        src: '/images/projects/ninf/03.png',
        type: 'image',
      },
    ],
    theme: {
      accent: '#b8ecff',
      accentStrong: '#eefbff',
      accentRgb: '184 236 255',
      background: '#06101b',
      backgroundRgb: '6 16 27',
      surface: '#111b27',
      surfaceRgb: '17 27 39',
      textMain: '#edf8ff',
      textMuted: '#9bb6c8',
      textRgb: '237 248 255',
    },
  },
  {
    id: 'the-chamber',
    title: 'The Chamber',
    detail: 'QAOA scheduler · Research testbed',
    summary:
      'A research testbed for hybrid quantum-classical process scheduling with QUBO and QAOA.',
    description:
      'A website and research surface exposing a hybrid quantum-classical scheduling algorithm for process-to-core assignment using QUBO and QAOA.',
    contribution:
      'Built the scheduling testbed with QUBO construction, PennyLane QAOA solving, brute-force validation, iterative sub-QUBO decomposition, and visual diagnostics.',
    category: 'Research',
    builtSections: [
      {
        title: 'Scheduling Model',
        detail: 'Process-to-core assignment translated into QUBO formulations.',
      },
      {
        title: 'Solver Workflow',
        detail: 'PennyLane QAOA loop with brute-force validation for comparison.',
      },
      {
        title: 'Visual Diagnostics',
        detail: 'Iterative sub-QUBO decomposition and result inspection tools.',
      },
    ],
    stack: ['Python', 'PennyLane', 'QAOA', 'QUBO'],
    year: '2026',
    timelineLabel: 'Year',
    role: 'Developer',
    buildMeta: 'Published July 2026',
    links: [
      {
        label: '▶ OPEN PROJECT',
        href: 'https://github.com/Tomas-Simoes/Hybrid-Quantum-Classical-Testbed-For-Operating-System-Scheduling',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #0d0905, #2a2111 50%, #d9ad57)',
    coverImage: '/images/projects/chamber/cover.png',
    previewMedia: [
      {
        src: '/images/projects/chamber/00.png',
        type: 'image',
      },
      {
        src: '/images/projects/chamber/02.png',
        type: 'image',
      },
      {
        src: '/images/projects/chamber/03.png',
        type: 'image',
      },
      {
        src: '/images/projects/chamber/04.png',
        type: 'image',
      },
    ],
    theme: {
      accent: '#d9ad57',
      accentStrong: '#f4d98b',
      accentRgb: '217 173 87',
      background: '#100d07',
      backgroundRgb: '16 13 7',
      surface: '#1d170d',
      surfaceRgb: '29 23 13',
      textMain: '#f8f0df',
      textMuted: '#b6a98e',
      textRgb: '248 240 223',
    },
  },
];

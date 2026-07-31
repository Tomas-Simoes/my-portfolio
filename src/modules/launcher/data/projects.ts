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
  previewLabel: string;
  launchPrompt: string;
  buildMeta: string;
  links: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }[];
  cover: string;
  image?: string;
  theme: ProjectTheme;
};

export const projects: Project[] = [
  {
    id: 'aspect-of-light',
    title: 'Aspect of Light',
    detail: 'Souls-like prototype · Unity',
    summary:
      'A complete top-down souls-like vertical slice centred around exploration and a boss encounter.',
    description:
      'A top-down souls-like action game built in 2023, with a full game architecture behind one explorable build and a focused boss encounter.',
    contribution:
      'Built the core gameplay systems, including inventory, enemies, camera management, NPC dialogue, ability progression, areas, and combat flow.',
    category: 'Game',
    builtSections: [
      {
        title: 'Combat & Enemies',
        detail: 'Player combat, enemy behaviour and the complete boss encounter.',
      },
      {
        title: 'Inventory & Progression',
        detail: 'Equipment, items and an ability progression system.',
      },
      {
        title: 'World Systems',
        detail: 'NPC dialogue, camera management, areas and gameplay flow.',
      },
    ],
    stack: ['Unity', 'C#', 'Game Architecture'],
    year: '2023',
    timelineLabel: 'Year',
    role: 'Game Developer',
    previewLabel: 'Boss arena',
    launchPrompt: 'READY TO INSTALL',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    links: [
      {
        label: '▶ INSTALL',
        href: 'https://github.com/Tomas-Simoes/Aspect-of-Light',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #050b08, #122a1d 48%, #7ee787)',
    image: '/images/aspect-light-cover.png',
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
    detail: 'Indoor measurement · Machine learning',
    summary:
      'A computer-vision measurement prototype for estimating indoor wall and window dimensions from photos.',
    description:
      'A FamousGadget internship prototype for estimating indoor window and wall measurements from photos using machine learning and geometric calculations.',
    contribution:
      'Built a computer-vision measurement pipeline around image prediction, reference-point recognition, camera parameters, and geometric correction.',
    category: 'Computer Vision',
    builtSections: [
      {
        title: 'Detection Pipeline',
        detail: 'Photo prediction flow for reference points, windows and wall features.',
      },
      {
        title: 'Geometric Measurement',
        detail: 'Camera parameters, reference scaling and correction calculations.',
      },
      {
        title: 'Research Output',
        detail: 'Experiment flow and paper-ready measurement results.',
      },
    ],
    stack: ['Python', 'Ultralytics', 'YOLO', 'Geometry'],
    year: '2025',
    timelineLabel: 'Paper',
    role: 'ML Developer',
    previewLabel: 'Measurement pipeline',
    launchPrompt: 'READY TO VIEW',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
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
    image: '/images/acharya-cover.png',
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
      'A student association app for course information, event engagement and member reward flows.',
    description:
      'An application for the NINF student association at UBI, designed as a course information hub and member point system for events and rewards.',
    contribution:
      'Built the student-facing experience around course information, event attendance, points, rewards, and backend-backed member flows.',
    category: 'App',
    builtSections: [
      {
        title: 'Member Experience',
        detail: 'Course hub, event attendance and points balance views.',
      },
      {
        title: 'Rewards Loop',
        detail: 'Points-to-prizes flow for association participation.',
      },
      {
        title: 'App Architecture',
        detail: 'Expo screens connected to backend-backed member data.',
      },
    ],
    stack: ['Expo', 'React Native', 'Backend API'],
    year: 'UBI',
    timelineLabel: 'Context',
    role: 'App Developer',
    previewLabel: 'Member portal',
    launchPrompt: 'READY TO LAUNCH',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    links: [
      {
        label: '▶ OPEN PROJECT',
        href: 'https://app.ninf.org/home',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #06111c, #173150 52%, #b8ecff)',
    image: '/images/ninf-cover.png',
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
    role: 'Research Developer',
    previewLabel: 'Scheduling chamber',
    launchPrompt: 'READY TO LAUNCH',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    links: [
      {
        label: '▶ OPEN PROJECT',
        href: 'https://github.com/Tomas-Simoes/Hybrid-Quantum-Classical-Testbed-For-Operating-System-Scheduling',
        variant: 'primary',
      },
    ],
    cover: 'linear-gradient(135deg, #0d0905, #2a2111 50%, #d9ad57)',
    image: '/images/the-chamber-cover.png',
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

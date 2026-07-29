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
  description: string;
  contribution: string;
  category: string;
  stack: string[];
  year: string;
  timelineLabel: string;
  role: string;
  previewLabel: string;
  launchPrompt: string;
  buildMeta: string;
  achievements: {
    title: string;
    detail: string;
    rarity: string;
  }[];
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
    description:
      'A top-down souls-like action game built in 2023, with a full game architecture behind one explorable build and a focused boss encounter.',
    contribution:
      'Built the core gameplay systems, including inventory, enemies, camera management, NPC dialogue, ability progression, areas, and combat flow.',
    category: 'Game',
    stack: ['Unity', 'C#', 'Game Architecture'],
    year: '2023',
    timelineLabel: 'Year',
    role: 'Game Developer',
    previewLabel: 'Boss arena',
    launchPrompt: 'READY TO INSTALL',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    achievements: [
      {
        title: 'Boss Fight',
        detail: 'One complete encounter',
        rarity: 'Rare',
      },
      {
        title: 'Inventory Core',
        detail: 'Items and equipment',
        rarity: 'Common',
      },
      {
        title: 'Ability Tree',
        detail: 'Progression path built',
        rarity: 'Epic',
      },
    ],
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
    description:
      'A FamousGadget internship prototype for estimating indoor window and wall measurements from photos using machine learning and geometric calculations.',
    contribution:
      'Built a computer-vision measurement pipeline around image prediction, reference-point recognition, camera parameters, and geometric correction.',
    category: 'Computer Vision',
    stack: ['Python', 'Ultralytics', 'YOLO', 'Geometry'],
    year: '2025',
    timelineLabel: 'Paper',
    role: 'ML Developer',
    previewLabel: 'Measurement pipeline',
    launchPrompt: 'READY TO VIEW',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    achievements: [
      {
        title: 'Reference Markers',
        detail: 'Scene points detected',
        rarity: 'Common',
      },
      {
        title: 'Geometry Pass',
        detail: 'Distance estimates',
        rarity: 'Rare',
      },
      {
        title: 'Paper Trail',
        detail: 'Co-authored research',
        rarity: 'Epic',
      },
    ],
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
    description:
      'An application for the NINF student association at UBI, designed as a course information hub and member point system for events and rewards.',
    contribution:
      'Built the student-facing experience around course information, event attendance, points, rewards, and backend-backed member flows.',
    category: 'App',
    stack: ['Expo', 'React Native', 'Backend API'],
    year: 'UBI',
    timelineLabel: 'Context',
    role: 'App Developer',
    previewLabel: 'Member portal',
    launchPrompt: 'READY TO LAUNCH',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    achievements: [
      {
        title: 'Course Hub',
        detail: 'Information pages',
        rarity: 'Common',
      },
      {
        title: 'Event Points',
        detail: 'Attendance rewards',
        rarity: 'Rare',
      },
      {
        title: 'Reward Loop',
        detail: 'Points for prizes',
        rarity: 'Epic',
      },
    ],
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
    description:
      'A website and research surface exposing a hybrid quantum-classical scheduling algorithm for process-to-core assignment using QUBO and QAOA.',
    contribution:
      'Built the scheduling testbed with QUBO construction, PennyLane QAOA solving, brute-force validation, iterative sub-QUBO decomposition, and visual diagnostics.',
    category: 'Research',
    stack: ['Python', 'PennyLane', 'QAOA', 'QUBO'],
    year: '2026',
    timelineLabel: 'Year',
    role: 'Research Developer',
    previewLabel: 'Scheduling chamber',
    launchPrompt: 'READY TO LAUNCH',
    buildMeta: 'Live build · Version 1.0.3 · Updated July 2026',
    achievements: [
      {
        title: 'QUBO Forge',
        detail: 'Assignment model built',
        rarity: 'Common',
      },
      {
        title: 'QAOA Solver',
        detail: 'Quantum loop wired',
        rarity: 'Rare',
      },
      {
        title: 'Oracle Check',
        detail: 'Brute-force validation',
        rarity: 'Epic',
      },
    ],
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

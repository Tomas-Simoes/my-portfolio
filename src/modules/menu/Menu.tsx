import { useEffect, useMemo, useRef, useState } from 'react';
import { projects } from '../launcher/data/projects';
import styles from './Menu.module.css';

const MENU_STARTUP_SOUND = '/music/menu-startup.mp3';
const MENU_NAV_SOUND = '/music/menu-nav.mp3';
const MENU_STARTUP_VOLUME = 0.45;
const MENU_NAV_VOLUME = 0.42;

type MenuIcon = 'profile' | 'projects' | 'timeline' | 'skills' | 'trophy' | 'network';
type MenuActionIcon = 'github' | 'linkedin' | 'cv' | 'external';

const PROFILE_LINKS = {
  github: 'https://github.com/Tomas-Simoes',
  linkedin: 'https://www.linkedin.com/in/tomas-simoes/',
  cv: '/cv/cv.pdf',
} as const;

const PROFILE_IMAGE = {
  src: '/images/me.jpeg',
  alt: 'Tomás Simões',
} as const;

type MenuAction = {
  label: string;
  href: string;
  icon?: MenuActionIcon;
};

type MenuEntry = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  meta: string[];
  action?: MenuAction;
  actions?: MenuAction[];
  image?: {
    src: string;
    alt: string;
  };
};

type MenuSection = {
  id: string;
  label: string;
  icon: MenuIcon;
  entries: MenuEntry[];
};

function createPortfolioSections(): MenuSection[] {
  const projectEntries = projects.map((project) => ({
    id: project.id,
    label: project.title,
    eyebrow: project.detail,
    title: project.title,
    body: `${project.description} ${project.contribution}`,
    meta: [project.role, project.stack.join(' / '), project.buildMeta],
    action: project.links[0]
      ? {
        label: project.links[0].label.replace('▶ ', ''),
        href: project.links[0].href,
      }
      : undefined,
  }));

  return [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'profile',
      entries: [
        {
          id: 'profile-main',
          label: 'Tomás Simões',
          eyebrow: 'Developer Portfolio',
          title: 'Software Developer',
          body:
            'Turning ideas into clear and useful digital experiences — from games and web applications to research-driven prototypes that explore new technologies and solve real-world problems.',
          meta: ['Software Development', 'Web Development', 'Quantum Computing'],
          actions: [
            {
              label: 'GitHub profile',
              href: PROFILE_LINKS.github,
              icon: 'github',
            },
            {
              label: 'LinkedIn profile',
              href: PROFILE_LINKS.linkedin,
              icon: 'linkedin',
            },
            {
              label: 'CV',
              href: PROFILE_LINKS.cv,
              icon: 'cv',
            },
          ],
          image: PROFILE_IMAGE,
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'projects',
      entries: projectEntries,
    },
    {
      id: 'timeline',
      label: 'Journey',
      icon: 'timeline',
      entries: [
        {
          id: 'timeline-2026',
          label: '2026',
          eyebrow: 'BACHELOR’S FINAL PROJECT',
          title: 'Exploring Quantum Computing',
          body:
            'For the final project of my Bachelor’s degree, I developed The Chamber, combining software development and quantum computing to explore operating-system scheduling through hybrid quantum-classical methods.',
          meta: ['Python', 'QAOA / QUBO', 'Research'],
          action: {
            label: 'View Project',
            href: 'https://enterthechamber.vercel.app',
          },
        },
        {
          id: 'timeline-ninf',
          label: '2025',
          eyebrow: 'STUDENT ASSOCIATION',
          title: 'Leading a Team',
          body:
            'During my Bachelor’s degree, I led a team of six developers in building the NINF student application, coordinating development across the frontend and backend.',
          meta: ['Team Lead', 'React Native', 'NestJS'],
          action: {
            label: 'View Project',
            href: 'https://app.ninf.org/home',
          },
        },
        {
          id: 'timeline-bachelor',
          label: '2023',
          eyebrow: 'UNIVERSIDADE DA BEIRA INTERIOR',
          title: 'Bachelor’s Degree',
          body:
            'I began my Bachelor’s degree in Computer Engineering, strengthening my foundations in software development while exploring areas such as algorithms, operating systems, computer theory and math.',
          meta: ['Computer Engineering', 'Software Development', 'Research'],
        },
        {
          id: 'timeline-internship',
          label: '2023',
          eyebrow: 'FAMOUSGADGET',
          title: 'Software Developer Internship',
          body:
            'During my internship at FamousGadget, I worked on Acharya Measurement, a computer-vision prototype designed to estimate indoor wall and window dimensions from photographs.',
          meta: ['Python', 'Computer Vision', 'Ultralytics / YOLO'],
          action: {
            label: 'View Project',
            href: 'https://github.com/Tomas-Simoes/Acharya-Measure-Prototype',
          },
        },
        {
          id: 'timeline-vocational-final',
          label: '2023',
          eyebrow: 'VOCATIONAL COURSE FINAL PROJECT',
          title: 'First Large System',
          body:
            'For the final project of my vocational course, I developed Aspect of Light. Building a larger interconnected system strengthened my object-oriented programming skills and introduced me to the challenges of software architecture.',
          meta: ['Unity', 'C#', 'Object-Oriented Programming'],
          action: {
            label: 'VIEW PROJECT',
            href: 'https://github.com/Tomas-Simoes/Aspect-of-Light',
          },
        },
        {
          id: 'timeline-2020',
          label: '2020–2023',
          eyebrow: 'VOCATIONAL COURSE',
          title: 'Hello World!',
          body:
            'Completed a three-year vocational course in programming, where I explored different areas of technology and built the foundations for my career. These years gave me a broader understanding of how software and computer systems work.',
          meta: ['Programming', 'Databases & Networks', 'Computer Architecture'],
        },
        {
          id: 'timeline-2019',
          label: '2019',
          eyebrow: 'THE BEGINNING',
          title: 'Where It All Started',
          body:
            'I took my first steps into programming in my bedroom, following YouTube tutorials and figuring things out by myself — no AI, no shortcuts, just me and the computer. Good times!',
          meta: ['HTML & JavaScript', 'First Personal Projects'],
        },
      ],
    },
    {
      id: 'skills',
      label: 'Stack',
      icon: 'skills',
      entries: [
        {
          id: 'skills-web',
          label: 'Web',
          eyebrow: 'Web Development',
          title: 'Full-stack Developer',
          body:
            'Experience building interfaces, backend services, and persistent web systems using relational and non-relational databases.',
          meta: ['ReactJS', 'NestJS & Ruby', 'MySQL & MongoDB'],
        },
        {
          id: 'skills-software',
          label: 'Software',
          eyebrow: 'Software Development',
          title: 'Object-oriented systems',
          body:
            'Comfortable structuring applications with object-oriented programming and Python',
          meta: ['C#/Java', 'Python', 'OCaml'],
        },
        {
          id: 'skills-quantum',
          label: 'Quantum',
          eyebrow: 'Quantum Computing',
          title: 'Aspiring Quantum Computing Engineer',
          body:
            'Interested in pursuing a career in quantum computing by combining my software engineering background with quantum algorithms.',
          meta: ['QUBO / QAOA', 'PennyLane', 'Research'],
        },
      ],
    },
    {
      id: 'achievements',
      label: 'Built',
      icon: 'trophy',
      entries: projects.flatMap((project) =>
        project.builtSections.map((section) => ({
          id: `${project.id}-${section.title}`,
          label: section.title,
          eyebrow: project.title,
          title: section.title,
          body: section.detail,
          meta: [project.role, project.stack.slice(0, 2).join(' / '), project.year],
          action: project.links[0]
            ? {
              label: 'Open Source',
              href: project.links[0].href,
            }
            : undefined,
        })),
      ),
    },
    {
      id: 'contact',
      label: 'Network',
      icon: 'network',
      entries: [
        {
          id: 'contact-github',
          label: 'GitHub',
          eyebrow: 'Code Archive',
          title: 'Tomas-Simoes',
          body:
            'Primary public source for the portfolio repositories, project prototypes, and research experiments listed here.',
          meta: ['Project repos', 'Source code', 'Portfolio archive'],
          action: {
            label: 'Open GitHub',
            href: 'https://github.com/Tomas-Simoes',
          },
        },
        {
          id: 'contact-ninf',
          label: 'NINF App',
          eyebrow: 'Live Surface',
          title: 'app.ninf.org',
          body:
            'A deployed student-association app experience connected to the NINF project entry.',
          meta: ['Expo', 'React Native', 'Live app'],
          action: {
            label: 'Open App',
            href: 'https://app.ninf.org/home',
          },
        },
      ],
    },
  ];
}

function clampMenuIndex(index: number, length: number) {
  return (index + length) % length;
}

function formatMenuClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function Icon({ type }: { type: MenuIcon }) {
  switch (type) {
    case 'profile':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M16 40v-3.8c0-4.6 3.6-8.2 8-8.2s8 3.6 8 8.2V40" />
          <path d="M24 24a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
          <path d="M9 40h30" />
        </svg>
      );
    case 'projects':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 17h12l3.4-5H40v25H8V17Z" />
          <path d="M8 22h32" />
          <path d="M16 31h16" />
        </svg>
      );
    case 'timeline':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 12v24h26" />
          <path d="M17 32 25 22l6 5 7-11" />
          <path d="M25 22h1" />
          <path d="M31 27h1" />
          <path d="M38 16h1" />
        </svg>
      );
    case 'skills':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M15 11h18l5 9-14 19L10 20l5-9Z" />
          <path d="m10 20 14 4 14-4" />
          <path d="m15 11 9 13 9-13" />
        </svg>
      );
    case 'trophy':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M17 11h14v9c0 5-3 9-7 9s-7-4-7-9v-9Z" />
          <path d="M17 15h-6v4c0 4 3 7 7 7" />
          <path d="M31 15h6v4c0 4-3 7-7 7" />
          <path d="M24 29v7" />
          <path d="M17 39h14" />
        </svg>
      );
    case 'network':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 38c7.7 0 14-6.3 14-14s-6.3-14-14-14-14 6.3-14 14 6.3 14 14 14Z" />
          <path d="M10 24h28" />
          <path d="M24 10c3.5 3.8 5.2 8.5 5.2 14S27.5 34.2 24 38" />
          <path d="M24 10c-3.5 3.8-5.2 8.5-5.2 14S20.5 34.2 24 38" />
        </svg>
      );
  }
}

function ActionIcon({ type = 'external' }: { type?: MenuActionIcon }) {
  switch (type) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.21c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.32 9.32 0 0 1 12 6.65c.85 0 1.7.12 2.5.34 1.91-1.31 2.75-1.04 2.75-1.04.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.73 0 3.91-2.34 4.77-4.57 5.02.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.17 10.17 0 0 0 22 12.21C22 6.58 17.52 2 12 2Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M6.94 8.98H3.85v10.3h3.09V8.98Z" />
          <path d="M5.4 4.02a1.79 1.79 0 1 0 0 3.58 1.79 1.79 0 0 0 0-3.58Z" />
          <path d="M20.15 13.63c0-3.1-1.65-4.54-3.86-4.54a3.34 3.34 0 0 0-3.03 1.67h-.04V8.98h-2.96v10.3h3.08v-5.1c0-1.35.26-2.65 1.93-2.65 1.64 0 1.66 1.54 1.66 2.74v5.01h3.08l.14-5.65Z" />
        </svg>
      );
    case 'cv':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2.75h7.4L18 7.35v13.9H6V2.75Z" />
          <path d="M13.2 2.95v4.6h4.6" />
          <path d="M8.8 12.1h6.4" />
          <path d="M8.8 15.2h6.4" />
          <path d="M8.8 18.3h4" />
        </svg>
      );
    case 'external':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7" />
          <path d="M9 7h8v8" />
          <path d="M6 5h-1v14h14v-1" />
        </svg>
      );
  }
}

type MenuProps = {
  onOpenProjects: () => void;
};

export function Menu({ onOpenProjects }: MenuProps) {
  const sections = useMemo(() => createPortfolioSections(), []);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeEntryIndex, setActiveEntryIndex] = useState(0);
  const [clock, setClock] = useState(() => new Date());
  const navSoundRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  const activeSection = sections[activeSectionIndex];
  const activeEntry = activeSection.entries[activeEntryIndex];
  const activeActions = activeEntry.actions ?? (activeEntry.action ? [activeEntry.action] : []);
  const isProfileSection = activeSection.id === 'profile';
  const isStackSection = activeSection.id === 'skills';
  const activeImage = isProfileSection ? activeEntry.image : undefined;

  useEffect(() => {
    const startupSound = new Audio(MENU_STARTUP_SOUND);
    const navSound = new Audio(MENU_NAV_SOUND);

    startupSound.volume = MENU_STARTUP_VOLUME;
    navSound.volume = MENU_NAV_VOLUME;
    navSound.preload = 'auto';
    navSound.load();
    navSoundRef.current = navSound;

    void startupSound.play().catch(() => undefined);

    const readyTimer = window.setTimeout(() => {
      menuRef.current?.focus();
    }, 420);

    return () => {
      window.clearTimeout(readyTimer);
      startupSound.pause();
      startupSound.currentTime = 0;
      navSound.pause();
      navSound.currentTime = 0;
      navSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  function playMenuNavSound() {
    const navSound = navSoundRef.current;

    if (!navSound) {
      return;
    }

    navSound.currentTime = 0;
    void navSound.play().catch(() => undefined);
  }

  function selectSection(nextSectionIndex: number) {
    const nextIndex = clampMenuIndex(nextSectionIndex, sections.length);

    if (nextIndex === activeSectionIndex) {
      return;
    }

    playMenuNavSound();
    setActiveSectionIndex(nextIndex);
    setActiveEntryIndex(0);
  }

  function selectEntry(nextEntryIndex: number) {
    const nextIndex = clampMenuIndex(nextEntryIndex, activeSection.entries.length);

    if (nextIndex === activeEntryIndex) {
      return;
    }

    playMenuNavSound();
    setActiveEntryIndex(nextIndex);
  }

  function openActiveEntry() {
    if (activeSection.id === 'projects') {
      playMenuNavSound();
      onOpenProjects();
      return;
    }

    const [firstAction] = activeActions;

    if (!firstAction) {
      return;
    }

    window.open(firstAction.href, '_blank', 'noopener,noreferrer');
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        selectSection(activeSectionIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        selectSection(activeSectionIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectEntry(activeEntryIndex - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        selectEntry(activeEntryIndex + 1);
        break;
      case 'Enter':
        openActiveEntry();
        break;
      default:
        break;
    }
  }

  return (
    <section
      ref={menuRef}
      className={styles.menu}
      data-active-section={activeSection.id}
      aria-label="Portfolio console menu"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.waves} aria-hidden="true">
        <svg
          className={styles.waveCanvas}
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            <linearGradient id="portfolio-menu-wave-back" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ede8dc" stopOpacity="0.08" />
              <stop offset="0.48" stopColor="#e8794e" stopOpacity="0.24" />
              <stop offset="1" stopColor="#0b0d0f" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="portfolio-menu-wave-main" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#1a1f24" stopOpacity="0.2" />
              <stop offset="0.28" stopColor="#d9663d" stopOpacity="0.42" />
              <stop offset="0.56" stopColor="#f1c38a" stopOpacity="0.25" />
              <stop offset="0.82" stopColor="#e8794e" stopOpacity="0.28" />
              <stop offset="1" stopColor="#121518" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="portfolio-menu-wave-front" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#120d0b" stopOpacity="0.9" />
              <stop offset="0.46" stopColor="#7a3f2b" stopOpacity="0.78" />
              <stop offset="1" stopColor="#080909" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="portfolio-menu-wave-ridge" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ede8dc" stopOpacity="0" />
              <stop offset="0.28" stopColor="#ede8dc" stopOpacity="0.36" />
              <stop offset="0.5" stopColor="#e8794e" stopOpacity="0.42" />
              <stop offset="0.76" stopColor="#ede8dc" stopOpacity="0.26" />
              <stop offset="1" stopColor="#ede8dc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className={styles.waveLayerBack}
            d="M0 236C139 152 254 181 386 218C552 265 610 126 787 169C949 209 1006 315 1172 233C1280 180 1362 185 1440 221V520H0Z"
          />
          <path
            className={styles.waveLayerMain}
            d="M0 292C125 219 244 247 381 281C535 320 657 208 826 244C995 281 1047 346 1197 286C1287 249 1367 252 1440 281V520H0Z"
          />
          <path
            className={styles.waveLayerFront}
            d="M0 337C145 294 232 326 355 355C513 392 642 328 800 340C959 352 1061 400 1205 346C1305 309 1375 319 1440 345V520H0Z"
          />
          <path
            className={styles.waveRidge}
            d="M-20 284C118 220 242 250 381 281C535 320 657 208 826 244C995 281 1047 346 1197 286C1287 249 1367 252 1460 281"
          />
          <path
            className={styles.waveSpark}
            d="M0 316C158 285 247 324 388 339C540 355 642 300 793 302C958 304 1073 365 1210 330C1310 304 1376 315 1440 338"
          />
        </svg>
      </div>

      <header className={styles.statusBar}>
        <strong>Tomás Simões</strong>
        <div className={styles.systemStatus}>
          <time dateTime={clock.toISOString()}>{formatMenuClock(clock)}</time>
          <span className={styles.signal} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.battery} aria-label="Portfolio loaded" />
        </div>
      </header>

      <div className={styles.crossbar}>
        <nav className={styles.categoryRail} aria-label="Portfolio categories">
          {sections.map((section, sectionIndex) => (
            <button
              key={section.id}
              className={`${styles.categoryButton} ${sectionIndex === activeSectionIndex ? styles.activeCategoryButton : ''
                }`}
              type="button"
              aria-pressed={sectionIndex === activeSectionIndex}
              onClick={() => {
                if (section.id === 'projects') {
                  playMenuNavSound();
                  onOpenProjects();
                  return;
                }

                selectSection(sectionIndex);
              }}
              title={section.label}
            >
              <Icon type={section.icon} />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        {!isProfileSection && !isStackSection ? (
          <div className={styles.submenuShell}>
            <div className={styles.submenuGlow} aria-hidden="true" />
            <ul className={styles.submenu} aria-label={`${activeSection.label} entries`}>
              {activeSection.entries.map((entry, entryIndex) => (
                <li key={entry.id}>
                  <button
                    className={`${styles.submenuButton} ${entryIndex === activeEntryIndex ? styles.activeSubmenuButton : ''
                      }`}
                    type="button"
                    aria-pressed={entryIndex === activeEntryIndex}
                    onClick={() => selectEntry(entryIndex)}
                  >
                    <span className={styles.entryGlyph}>{entry.label.slice(0, 2).toUpperCase()}</span>
                    <span>{entry.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {isStackSection ? (
        <article className={styles.stackPanel} aria-labelledby="stack-heading">
          <div className={styles.stackHeader}>
            <p className={styles.eyebrow}>Tools & Frameworks</p>
            <h1 id="stack-heading">Technical Stack</h1>
            <p className={styles.bodyCopy}>
              A mix of modern web technologies, core software engineering principles, and tools for exploring quantum computing.
            </p>
          </div>

          <div className={styles.stackFocusGrid} aria-label="Stack focal points">
            {activeSection.entries.map((entry, entryIndex) => (
              <button
                key={entry.id}
                className={`${styles.focusCard} ${entryIndex === activeEntryIndex ? styles.activeFocusCard : ''
                  }`}
                type="button"
                aria-pressed={entryIndex === activeEntryIndex}
                onClick={() => selectEntry(entryIndex)}
              >
                <span className={styles.focusNumber}>{String(entryIndex + 1).padStart(2, '0')}</span>
                <span className={styles.focusEyebrow}>{entry.eyebrow}</span>
                <strong>{entry.title}</strong>
                <span className={styles.focusBody}>{entry.body}</span>
                <span className={styles.stackPillList}>
                  {entry.meta.map((metaItem) => (
                    <span key={`${entry.id}-${metaItem}`}>{metaItem}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </article>
      ) : (
        <article
          className={`${styles.detailPanel} ${isProfileSection ? styles.profileDetailPanel : ''}`}
          aria-live="polite"
        >
          <div className={styles.detailContent}>
            <p className={styles.eyebrow}>{activeEntry.eyebrow}</p>
            <h1>{activeEntry.title}</h1>
            <p className={styles.bodyCopy}>{activeEntry.body}</p>
            <dl className={styles.metaList}>
              {activeEntry.meta.map((metaItem, index) => (
                <div key={`${activeEntry.id}-${metaItem}`}>
                  <dt>{String(index + 1).padStart(2, '0')}</dt>
                  <dd>{metaItem}</dd>
                </div>
              ))}
            </dl>
            {activeActions.length > 0 ? (
              <div className={styles.actionList} aria-label={`${activeEntry.label} links`}>
                {activeActions.map((action) => (
                  <a
                    key={`${activeEntry.id}-${action.label}`}
                    className={`${styles.actionButton} ${action.icon ? styles.iconActionButton : ''}`}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={action.label}
                    title={action.label}
                  >
                    {action.icon ? <ActionIcon type={action.icon} /> : action.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {activeImage ? (
            <div className={styles.profileImageSlot}>
              {activeImage.src ? (
                <img src={activeImage.src} alt={activeImage.alt} />
              ) : (
                <span aria-hidden="true">TS</span>
              )}
            </div>
          ) : null}
        </article>
      )}

      <div className={styles.sectionCounter} aria-hidden="true">
        <span>{String(activeSectionIndex + 1).padStart(2, '0')}</span>
        <i />
        <span>{String(sections.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}

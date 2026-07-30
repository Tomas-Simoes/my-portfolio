import { useEffect, useRef, useState } from 'react';
import { projects } from './data/projects';
import styles from './GameLauncher.module.css';
import { GameCarousel } from './components/GameCarousel';
import { ProjectDetails } from './components/ProjectDetails';
import { createBackdropStyle, createLauncherThemeStyle } from './launcherThemeStyle';

const MENU_STARTUP_SOUND = '/music/menu-startup.mp3';
const MENU_NAV_SOUND = '/music/menu-nav.mp3';
const STARTUP_WAIT_MS = 750;
const STARTUP_ANIMATION_MS = 2200;
const MENU_STARTUP_VOLUME = 0.5;
const MENU_NAV_VOLUME = 0.45;

type StartupPhase = 'waiting' | 'starting' | 'ready';

export function GameLauncher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startupPhase, setStartupPhase] = useState<StartupPhase>('waiting');
  const navSoundRef = useRef<HTMLAudioElement | null>(null);
  const activeProject = projects[activeIndex];
  const launcherThemeStyle = createLauncherThemeStyle(activeProject.theme);

  useEffect(() => {
    const startupSound = new Audio(MENU_STARTUP_SOUND);
    const navSound = new Audio();

    startupSound.volume = MENU_STARTUP_VOLUME;
    navSound.volume = MENU_NAV_VOLUME;
    navSound.preload = 'auto';
    navSound.src = MENU_NAV_SOUND;
    navSound.load();
    navSoundRef.current = navSound;

    void startupSound.play().catch(() => undefined);

    const startTimer = window.setTimeout(() => {
      setStartupPhase('starting');
    }, STARTUP_WAIT_MS);
    const finishTimer = window.setTimeout(() => {
      setStartupPhase('ready');
    }, STARTUP_WAIT_MS + STARTUP_ANIMATION_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
      startupSound.pause();
      startupSound.currentTime = 0;
      navSound.pause();
      navSound.currentTime = 0;
      navSoundRef.current = null;
    };
  }, []);

  function playMenuNavSound() {
    const navSound = navSoundRef.current;

    if (!navSound) {
      return;
    }

    navSound.currentTime = 0;
    void navSound.play().catch(() => undefined);
  }

  function changeActiveIndex(nextIndex: number) {
    if (nextIndex === activeIndex) {
      return;
    }

    playMenuNavSound();
    setActiveIndex(nextIndex);
  }

  const launcherClassName = [
    styles.launcher,
    startupPhase === 'waiting' ? styles.launcherWaiting : '',
    startupPhase === 'starting' ? styles.launcherStarting : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleCarousel(step: number) {
    changeActiveIndex((activeIndex + step + projects.length) % projects.length);
  }

  function handleSelect(projectIndex: number) {
    changeActiveIndex(projectIndex);
  }

  return (
    <section
      className={launcherClassName}
      style={launcherThemeStyle}
      data-theme={activeProject.id}
    >
      <div className={styles.themeBackdrop} aria-hidden="true">
        {projects.map((project, projectIndex) => {
          const backdropStyle = createBackdropStyle(project.theme);

          return (
            <span
              key={project.id}
              className={`${styles.themeBackdropLayer} ${projectIndex === activeIndex ? styles.activeThemeBackdropLayer : ''
                }`}
              style={backdropStyle}
            />
          );
        })}
      </div>
      <header className={styles.topbar}>
        <div className={styles.identity}>
          <strong>Tomás Simões</strong>
          <span>
            <i />
            Online
          </span>
        </div>
        <nav className={styles.nav} aria-label="Portfolio navigation">
          <a href="#about">Library</a>
          <a href="#cv">Career</a>
          <a href="#contact">Achievements</a>
        </nav>
      </header>

      <GameCarousel
        projects={projects}
        activeIndex={activeIndex}
        onMove={handleCarousel}
        onSelect={handleSelect}
      />
      <ProjectDetails
        project={activeProject}
        activeIndex={activeIndex}
        totalProjects={projects.length}
      />
    </section>
  );
}

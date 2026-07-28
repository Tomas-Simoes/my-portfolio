import type { CSSProperties } from 'react';
import { useState } from 'react';
import { projects } from './data/projects';
import styles from './GameLauncher.module.css';
import { GameCarousel } from './components/GameCarousel';
import { ProjectDetails } from './components/ProjectDetails';

type LauncherThemeStyle = CSSProperties & {
  '--theme-accent': string;
  '--theme-accent-strong': string;
  '--theme-accent-rgb': string;
  '--theme-background': string;
  '--theme-background-rgb': string;
  '--theme-surface': string;
  '--theme-surface-rgb': string;
  '--theme-text-main': string;
  '--theme-text-muted': string;
  '--theme-text-rgb': string;
};

type BackdropStyle = CSSProperties & {
  '--backdrop-accent-rgb': string;
  '--backdrop-background': string;
  '--backdrop-background-rgb': string;
  '--backdrop-surface-rgb': string;
};

export function GameLauncher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const activeTheme = activeProject.theme;
  const launcherThemeStyle: LauncherThemeStyle = {
    '--theme-accent': activeTheme.accent,
    '--theme-accent-strong': activeTheme.accentStrong,
    '--theme-accent-rgb': activeTheme.accentRgb,
    '--theme-background': activeTheme.background,
    '--theme-background-rgb': activeTheme.backgroundRgb,
    '--theme-surface': activeTheme.surface,
    '--theme-surface-rgb': activeTheme.surfaceRgb,
    '--theme-text-main': activeTheme.textMain,
    '--theme-text-muted': activeTheme.textMuted,
    '--theme-text-rgb': activeTheme.textRgb,
  };

  function handleCarousel(step: number) {
    setActiveIndex((index) => (index + step + projects.length) % projects.length);
  }

  return (
    <section
      className={styles.launcher}
      style={launcherThemeStyle}
      data-theme={activeProject.id}
    >
      <div className={styles.themeBackdrop} aria-hidden="true">
        {projects.map((project, projectIndex) => {
          const backdropStyle: BackdropStyle = {
            '--backdrop-accent-rgb': project.theme.accentRgb,
            '--backdrop-background': project.theme.background,
            '--backdrop-background-rgb': project.theme.backgroundRgb,
            '--backdrop-surface-rgb': project.theme.surfaceRgb,
          };

          return (
            <span
              key={project.id}
              className={`${styles.themeBackdropLayer} ${
                projectIndex === activeIndex ? styles.activeThemeBackdropLayer : ''
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
        onSelect={setActiveIndex}
      />
      <ProjectDetails
        project={activeProject}
        activeIndex={activeIndex}
        totalProjects={projects.length}
        onMove={handleCarousel}
      />
    </section>
  );
}

import { useState } from 'react';
import { projects } from './data/projects';
import styles from './GameLauncher.module.css';
import { GameCarousel } from './components/GameCarousel';
import { ProjectDetails } from './components/ProjectDetails';
import { createBackdropStyle, createLauncherThemeStyle } from './launcherThemeStyle';

export function GameLauncher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const launcherThemeStyle = createLauncherThemeStyle(activeProject.theme);

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
          const backdropStyle = createBackdropStyle(project.theme);

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
      />
    </section>
  );
}

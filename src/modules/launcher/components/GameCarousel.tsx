import type { Project } from '../data/projects';
import styles from '../GameLauncher.module.css';
import { GameCard } from './GameCard';

type GameCarouselProps = {
  projects: Project[];
  activeIndex: number;
  onMove: (step: number) => void;
  onSelect: (index: number) => void;
};

export function GameCarousel({
  projects,
  activeIndex,
  onMove,
  onSelect,
}: GameCarouselProps) {
  const visibleIndexes = [-1, 0, 1].map((offset) => (
    (activeIndex + offset + projects.length) % projects.length
  ));
  const count = String(activeIndex + 1).padStart(2, '0');
  const total = String(projects.length).padStart(2, '0');

  return (
    <div className={styles.carouselShell}>
      <div className={styles.libraryBar}>
        <span>Installed builds</span>
        <strong>{count} / {total}</strong>
      </div>
      <div className={styles.carouselControls}>
        <button onClick={() => onMove(-1)} aria-label="Previous project">
          ←
        </button>
        <div className={styles.carousel} aria-label="Project carousel">
          {visibleIndexes.map((projectIndex) => {
            const project = projects[projectIndex];

            return (
              <GameCard
                key={project.id}
                project={project}
                isActive={projectIndex === activeIndex}
                onSelect={() => onSelect(projectIndex)}
              />
            );
          })}
        </div>
        <button onClick={() => onMove(1)} aria-label="Next project">
          →
        </button>
      </div>
      <div className={styles.libraryDots} aria-hidden="true">
        {projects.map((project, projectIndex) => (
          <span
            key={project.id}
            className={projectIndex === activeIndex ? styles.activeDot : ''}
          />
        ))}
      </div>
    </div>
  );
}

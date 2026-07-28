import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';
import styles from '../GameLauncher.module.css';

type CardStyle = CSSProperties & {
  '--cover': string;
};

type GameCardProps = {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
};

export function GameCard({ project, isActive, onSelect }: GameCardProps) {
  return (
    <button
      className={`${styles.card} ${project.image ? styles.imageCard : ''} ${
        isActive ? styles.activeCard : ''
      }`}
      onClick={onSelect}
      style={{ '--cover': project.cover } as CardStyle}
      aria-pressed={isActive}
    >
      {project.image ? (
        <img className={styles.cardImage} src={project.image} alt="" aria-hidden="true" />
      ) : null}
      <span className={styles.cardCategory}>{project.category}</span>
      <span className={styles.logo}>{project.title}</span>
    </button>
  );
}

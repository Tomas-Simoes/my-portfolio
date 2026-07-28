import type { Project } from '../data/projects';
import styles from '../GameLauncher.module.css';

type ProjectDetailsProps = {
  project: Project;
  activeIndex: number;
  totalProjects: number;
  onMove: (step: number) => void;
};

export function ProjectDetails({
  project,
  activeIndex,
  totalProjects,
  onMove,
}: ProjectDetailsProps) {
  const count = String(activeIndex + 1).padStart(2, '0');
  const total = String(totalProjects).padStart(2, '0');

  return (
    <footer className={styles.gameInfo} aria-live="polite">
      <div className={styles.projectHeader}>
        <p className={styles.count}>
          {count} / {total}
        </p>
        <p className={styles.kicker}>{project.detail}</p>
      </div>

      <div className={styles.projectBody}>
        <div className={styles.copy}>
          <h1>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          <p className={styles.contribution}>{project.contribution}</p>

          <p className={styles.stack}>{project.stack.join(' · ')}</p>

          <div className={styles.actions}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  link.variant === 'primary' ? styles.primaryAction : styles.textAction
                }
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.sidePanel}>
          <aside className={styles.previewPanel} aria-label={`${project.title} preview`}>
            <div className={styles.previewWindow}>
              <span>{project.previewLabel}</span>
              <div className={styles.previewLines}>
                <i />
                <i />
                <i />
              </div>
            </div>
          </aside>

          <div className={styles.meta}>
            <dl>
              <div>
                <dt>{project.timelineLabel}</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
            </dl>
          </div>

          <section className={styles.achievements} aria-label={`${project.title} achievements`}>
            <div className={styles.achievementsHeader}>
              <p>Achievements</p>
              <span>{project.achievements.length} unlocked</span>
            </div>
            <div className={styles.achievementList}>
              {project.achievements.map((achievement) => (
                <article className={styles.achievementBadge} key={achievement.title}>
                  <span aria-hidden="true">{achievement.title.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{achievement.title}</strong>
                    <small>{achievement.detail}</small>
                  </div>
                  <em>{achievement.rarity}</em>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => onMove(-1)} aria-label="Previous project">
          ←
        </button>
        <button onClick={() => onMove(1)} aria-label="Next project">
          →
        </button>
        <span>Browse</span>
        <span>Enter Open</span>
      </div>
    </footer>
  );
}

import type { Project } from '../data/projects';
import styles from '../GameLauncher.module.css';

type ProjectDetailsProps = {
  project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <footer className={styles.gameInfo} aria-live="polite">
      <div className={styles.projectBody}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{project.detail}</p>
          <p className={styles.summary}>{project.summary}</p>

          <section
            className={styles.builtPanel}
            aria-labelledby={`${project.id}-built-heading`}
          >
            <p className={styles.sectionLabel} id={`${project.id}-built-heading`}>
              What I built
            </p>
            <ul className={styles.buildList}>
              {project.builtSections.map((section) => (
                <li key={section.title}>
                  <strong>{section.title}</strong>
                  <span>{section.detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <details className={styles.developmentDetails}>
            <summary>View development details</summary>
            <div>
              <p>{project.description}</p>
              <p>{project.contribution}</p>
            </div>
          </details>

          <p className={styles.stack}>{project.stack.join(' · ')}</p>

          <div className={styles.launchDock}>
            <span className={styles.launchPrompt}>{project.launchPrompt}</span>
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
            <span className={styles.buildMeta}>{project.buildMeta}</span>
          </div>
        </div>

        <div className={styles.sidePanel}>
          <aside className={styles.previewPanel} aria-label={`${project.title} media`}>
            <div className={styles.previewWindow}>
              {project.image ? (
                <img
                  className={styles.previewImage}
                  src={project.image}
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
              <div className={styles.previewOverlay}>
                <span>Trailer / images</span>
                <strong>{project.previewLabel}</strong>
              </div>
            </div>
            <div className={styles.mediaStrip} aria-hidden="true">
              <span className={styles.activeMediaThumb}>
                {project.image ? <img src={project.image} alt="" /> : null}
              </span>
              <span />
              <span />
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
            </dl>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import type { Project, ProjectMedia } from '../data/projects';
import styles from '../GameLauncher.module.css';

const IMAGE_PREVIEW_DURATION_MS = 3500;

type ProjectDetailsProps = {
  project: Project;
};

function PreviewMedia({
  className,
  media,
  onEnded,
}: {
  className: string;
  media: ProjectMedia;
  onEnded: () => void;
}) {
  if (media.type === 'video') {
    return (
      <video
        key={media.src}
        className={className}
        src={media.src}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        onEnded={onEnded}
      />
    );
  }

  return <img className={className} src={media.src} alt="" aria-hidden="true" />;
}

function MediaThumb({ media }: { media: ProjectMedia }) {
  if (media.type === 'video') {
    return <video src={media.src} muted playsInline preload="metadata" aria-hidden="true" />;
  }

  return <img src={media.src} alt="" aria-hidden="true" />;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const coverMedia = project.coverImage
    ? ({ src: project.coverImage, type: 'image' } satisfies ProjectMedia)
    : undefined;
  const previewMedia = project.previewMedia ?? [];
  const mediaStripItems = previewMedia.length > 0 ? previewMedia : coverMedia ? [coverMedia] : [];
  const primaryPreview = mediaStripItems[activeMediaIndex] ?? mediaStripItems[0];

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [project.id]);

  useEffect(() => {
    if (!primaryPreview || primaryPreview.type !== 'image' || mediaStripItems.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveMediaIndex((currentIndex) => (currentIndex + 1) % mediaStripItems.length);
    }, IMAGE_PREVIEW_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [mediaStripItems.length, primaryPreview]);

  function showNextMedia() {
    if (mediaStripItems.length < 2) {
      return;
    }

    setActiveMediaIndex((currentIndex) => (currentIndex + 1) % mediaStripItems.length);
  }

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
              {primaryPreview ? (
                <PreviewMedia
                  className={styles.previewImage}
                  media={primaryPreview}
                  onEnded={showNextMedia}
                />
              ) : null}
              <div className={styles.previewOverlay}>
                <span>Trailer / images</span>
                <strong>{project.previewLabel}</strong>
              </div>
            </div>
            <div
              className={styles.mediaStrip}
              aria-label={`${project.title} trailer and images`}
            >
              {mediaStripItems.map((media, mediaIndex) => (
                <button
                  key={media.src}
                  className={`${styles.mediaThumb} ${
                    mediaIndex === activeMediaIndex ? styles.activeMediaThumb : ''
                  }`}
                  type="button"
                  onClick={() => setActiveMediaIndex(mediaIndex)}
                  aria-current={mediaIndex === activeMediaIndex ? 'true' : undefined}
                  aria-label={`Show ${project.title} ${
                    media.type === 'video'
                      ? 'trailer'
                      : `image ${String(mediaIndex).padStart(2, '0')}`
                  }`}
                >
                  <MediaThumb media={media} />
                </button>
              ))}
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

import { useEffect, useRef, useState } from 'react';
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
  const [fullscreenMedia, setFullscreenMedia] = useState<ProjectMedia | undefined>();
  const fullscreenCloseRef = useRef<HTMLButtonElement | null>(null);
  const coverMedia = project.coverImage
    ? ({ src: project.coverImage, type: 'image' } satisfies ProjectMedia)
    : undefined;
  const previewMedia = project.previewMedia ?? [];
  const mediaStripItems = previewMedia.length > 0 ? previewMedia : coverMedia ? [coverMedia] : [];
  const primaryPreview = mediaStripItems[activeMediaIndex] ?? mediaStripItems[0];

  useEffect(() => {
    setActiveMediaIndex(0);
    setFullscreenMedia(undefined);
  }, [project.id]);

  useEffect(() => {
    if (
      fullscreenMedia ||
      !primaryPreview ||
      primaryPreview.type !== 'image' ||
      mediaStripItems.length < 2
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveMediaIndex((currentIndex) => (currentIndex + 1) % mediaStripItems.length);
    }, IMAGE_PREVIEW_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [fullscreenMedia, mediaStripItems.length, primaryPreview]);

  useEffect(() => {
    if (!fullscreenMedia) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fullscreenCloseRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFullscreenMedia(undefined);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenMedia]);

  function showNextMedia() {
    if (mediaStripItems.length < 2) {
      return;
    }

    setActiveMediaIndex((currentIndex) => (currentIndex + 1) % mediaStripItems.length);
  }

  function openFullscreenPreview() {
    if (!primaryPreview) {
      return;
    }

    setFullscreenMedia(primaryPreview);
  }

  const previewContent = primaryPreview ? (
    <PreviewMedia
      className={styles.previewImage}
      media={primaryPreview}
      onEnded={showNextMedia}
    />
  ) : null;

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
            {primaryPreview ? (
              <button
                className={`${styles.previewWindow} ${styles.previewWindowButton}`}
                type="button"
                onClick={openFullscreenPreview}
                aria-label={`Open ${project.title} ${primaryPreview.type} full screen`}
                title="Open full screen"
              >
                {previewContent}
                <span className={styles.previewFullscreenIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M4 9V4h5" />
                    <path d="M20 9V4h-5" />
                    <path d="M4 15v5h5" />
                    <path d="M20 15v5h-5" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className={styles.previewWindow}>{previewContent}</div>
            )}
            <div
              className={styles.mediaStrip}
              aria-label={`${project.title} media previews`}
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
      {fullscreenMedia ? (
        <div
          className={styles.fullscreenPreview}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} full screen ${fullscreenMedia.type}`}
          onClick={() => setFullscreenMedia(undefined)}
        >
          <button
            ref={fullscreenCloseRef}
            className={styles.fullscreenClose}
            type="button"
            onClick={() => setFullscreenMedia(undefined)}
            aria-label="Close full screen media"
          >
            X
          </button>
          {fullscreenMedia.type === 'video' ? (
            <video
              className={styles.fullscreenVideo}
              src={fullscreenMedia.src}
              controls
              autoPlay
              muted
              playsInline
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <img
              className={styles.fullscreenImage}
              src={fullscreenMedia.src}
              alt=""
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </div>
      ) : null}
    </footer>
  );
}

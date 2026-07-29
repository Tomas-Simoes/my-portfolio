import styles from './ONScene.module.css';

type ONSceneProps = {
  onPowerOn: () => void;
};

export function ONScene({ onPowerOn }: ONSceneProps) {
  return (
    <section className={styles.scene} aria-label="Power screen">
      <div className={styles.screen} aria-hidden="true" />
      <button
        className={styles.powerButton}
        type="button"
        onClick={onPowerOn}
        aria-label="Power on"
      >
        <svg
          className={styles.powerIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2v10" />
          <path d="M18.4 6.6a8.8 8.8 0 1 1-12.8 0" />
        </svg>
      </button>
    </section>
  );
}

import type { CSSProperties } from 'react';
import { BootCanvas } from './components/BootCanvas';
import { BOOT_ROTATION_START_TIME, BOOT_TRANSITION_DURATION } from './lib/bootTimeline';
import styles from './BootSequenceScene.module.css';

export function BootSequenceScene() {
  const curtainStyle = {
    '--curtain-delay': `${BOOT_ROTATION_START_TIME}s`,
    '--curtain-duration': `${BOOT_TRANSITION_DURATION - BOOT_ROTATION_START_TIME}s`,
  } as CSSProperties;

  return (
    <section className={styles.bootSequence} aria-label="Boot sequence">
      <BootCanvas />
      <div className={styles.titlePlate}>
        <p>Tomás Simões Presents</p>
      </div>
      <div className={styles.fadeCurtain} style={curtainStyle} aria-hidden="true" />
    </section>
  );
}

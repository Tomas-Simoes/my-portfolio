import { useEffect, useState } from 'react';
import { GameLauncher } from '../launcher/GameLauncher';
import styles from './BootScene.module.css';
import { BootSequenceScene } from './BootSequenceScene';
import { useSoundtrack } from './hook/useSoundtrack';
import { BOOT_TRANSITION_DURATION } from './lib/bootTimeline';
import { ONScene } from './ONScene';

type BootPhase = 'off' | 'transitioning' | 'booting' | 'launcher';

const POWER_TRANSITION_MS = 600;
const LAUNCHER_DELAY_MS = Math.max(BOOT_TRANSITION_DURATION * 1000 - POWER_TRANSITION_MS, 0);

export function BootScene() {
  const [phase, setPhase] = useState<BootPhase>('off');
  const soundtrack = useSoundtrack();

  function handlePowerOn() {
    soundtrack.start();
    setPhase('transitioning');
  }

  useEffect(() => {
    if (phase !== 'transitioning') return;

    const timer = window.setTimeout(() => {
      setPhase('booting');
    }, POWER_TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'booting') return;

    const timer = window.setTimeout(() => {
      setPhase('launcher');
    }, LAUNCHER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'off') {
    return (
      <div className={styles.stage}>
        <div className={`${styles.layer} ${styles.powerLayer}`}>
          <ONScene onPowerOn={handlePowerOn} />
        </div>
      </div>
    );
  }

  if (phase === 'transitioning' || phase === 'booting') {
    return (
      <div className={styles.stage}>
        <div
          className={`${styles.layer} ${styles.bootLayer} ${
            phase === 'transitioning' ? styles.visibleBootLayer : ''
          }`}
        >
          <BootSequenceScene />
        </div>

        {phase === 'transitioning' ? (
          <div className={`${styles.layer} ${styles.powerLayer} ${styles.leavingPowerLayer}`}>
            <ONScene onPowerOn={handlePowerOn} />
          </div>
        ) : null}
      </div>
    );
  }

  return <GameLauncher />;
}

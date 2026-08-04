import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { GameLauncher } from '../launcher/GameLauncher';
import { Menu } from '../menu/Menu';
import styles from './BootScene.module.css';
import { BootSequenceScene } from './BootSequenceScene';
import { useSoundtrack } from './hook/useSoundtrack';
import { BOOT_TRANSITION_DURATION } from './lib/bootTimeline';
import { ONScene } from './ONScene';

type BootPhase = 'off' | 'transitioning' | 'booting' | 'menu' | 'launcher';

const BOOT_REVEAL_DELAY_MS = 500;
const BOOT_REVEAL_DURATION_MS = 1000;
const POWER_TRANSITION_MS = BOOT_REVEAL_DELAY_MS + BOOT_REVEAL_DURATION_MS;
const LAUNCHER_DELAY_MS = Math.max(BOOT_TRANSITION_DURATION * 1000 - POWER_TRANSITION_MS, 0);

const bootRevealStyle = {
  '--boot-reveal-delay': `${BOOT_REVEAL_DELAY_MS}ms`,
  '--boot-reveal-duration': `${BOOT_REVEAL_DURATION_MS}ms`,
} as CSSProperties;

export function BootScene() {
  const [phase, setPhase] = useState<BootPhase>('off');
  const soundtrack = useSoundtrack();

  function handlePowerOn() {
    soundtrack.start();
    setPhase('transitioning');
  }

  function handlePowerOff() {
    soundtrack.stop();
    setPhase('off');
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
      setPhase('menu');
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
          style={phase === 'transitioning' ? bootRevealStyle : undefined}
        >
          <BootSequenceScene />
        </div>
      </div>
    );
  }

  if (phase === 'launcher') {
    return <GameLauncher onBackToMenu={() => setPhase('menu')} />;
  }

  return <Menu onOpenProjects={() => setPhase('launcher')} onLeave={handlePowerOff} />;
}

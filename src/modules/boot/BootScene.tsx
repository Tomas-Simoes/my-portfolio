import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { GameLauncher } from '../launcher/GameLauncher';
import { Menu } from '../menu/Menu';
import styles from './BootScene.module.css';
import { BootSequenceScene } from './BootSequenceScene';
import { useSoundtrack } from './hook/useSoundtrack';
import { BOOT_TRANSITION_DURATION } from './lib/bootTimeline';
import { ONScene } from './ONScene';

type BootPhase = 'off' | 'transitioning' | 'booting' | 'menu' | 'poweringOff' | 'launcher';

const BOOT_REVEAL_DELAY_MS = 500;
const BOOT_REVEAL_DURATION_MS = 1000;
const POWER_TRANSITION_MS = BOOT_REVEAL_DELAY_MS + BOOT_REVEAL_DURATION_MS;
const LAUNCHER_DELAY_MS = Math.max(BOOT_TRANSITION_DURATION * 1000 - POWER_TRANSITION_MS, 0);
const POWER_OFF_FADE_MS = 350;

const bootRevealStyle = {
  '--boot-reveal-delay': `${BOOT_REVEAL_DELAY_MS}ms`,
  '--boot-reveal-duration': `${BOOT_REVEAL_DURATION_MS}ms`,
} as CSSProperties;

const powerOffCurtainStyle = {
  '--power-off-fade-duration': `${POWER_OFF_FADE_MS}ms`,
} as CSSProperties;

export function BootScene() {
  const [phase, setPhase] = useState<BootPhase>('off');
  const soundtrack = useSoundtrack();

  function handlePowerOn() {
    soundtrack.start();
    setPhase('transitioning');
  }

  function handlePowerOff() {
    setPhase((currentPhase) => (currentPhase === 'menu' ? 'poweringOff' : currentPhase));
  }

  function handleOpenProjects() {
    setPhase((currentPhase) => (currentPhase === 'menu' ? 'launcher' : currentPhase));
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

  useEffect(() => {
    if (phase !== 'poweringOff') return;

    const timer = window.setTimeout(() => {
      soundtrack.stop();
      setPhase('off');
    }, POWER_OFF_FADE_MS);

    return () => window.clearTimeout(timer);
  }, [phase, soundtrack]);

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
          className={`${styles.layer} ${styles.bootLayer} ${phase === 'transitioning' ? styles.visibleBootLayer : ''
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

  return (
    <div className={`${styles.stage} ${styles.menuStage}`}>
      <div className={styles.menuLayer}>
        <Menu onOpenProjects={handleOpenProjects} onLeave={handlePowerOff} />
      </div>
      {phase === 'poweringOff' ? (
        <div
          className={styles.powerOffCurtain}
          style={powerOffCurtainStyle}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

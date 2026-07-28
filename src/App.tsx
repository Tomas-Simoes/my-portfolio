import styles from './App.module.css';
import { GameLauncher } from './modules/launcher/GameLauncher';

export default function App() {
  return (
    <main className={styles.app}>
      <GameLauncher />
    </main>
  );
}

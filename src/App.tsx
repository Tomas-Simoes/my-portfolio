import styles from './App.module.css';
import { BootScene } from './modules/boot/BootScene';

export default function App() {
  return (
    <main className={styles.app}>
      <BootScene />
    </main>
  );
}

import styles from './App.module.css';
import { SceneEditor } from './modules/editor/SceneEditor';

export default function App() {
  return (
    <main className={styles.app}>
      <SceneEditor />
    </main>
  );
}

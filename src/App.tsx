import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, MeshDistortMaterial, OrbitControls, PresentationControls, Sparkles } from '@react-three/drei';
import styles from './App.module.css';

function PortfolioMark() {
  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.8}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.18, 2]} />
          <MeshDistortMaterial color="#4fd1c5" roughness={0.32} metalness={0.25} distort={0.16} speed={1.4} />
        </mesh>
        <mesh position={[-0.76, -0.58, 0.82]} rotation={[Math.PI / 2.2, 0, 0.55]}>
          <torusGeometry args={[0.34, 0.03, 16, 96]} />
          <meshStandardMaterial color="#f6f3e8" roughness={0.45} metalness={0.18} />
        </mesh>
      </Float>
      <Sparkles count={46} scale={3.9} size={1.1} speed={0.35} color="#7dd3fc" />
    </group>
  );
}

export default function App() {
  return (
    <main className={styles.shell}>
      <section className={styles.intro}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Simoes / interactive web</p>
          <h1>Simoes Portfolio.</h1>
          <p className={styles.summary}>
            Creative systems, precise interfaces, and real-time web experiences with a little spatial presence.
          </p>
          <div className={styles.actions}>
            <a href="mailto:hello@example.com">
              Contact
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section className={styles.stage} aria-label="Interactive portfolio mark">
        <Canvas camera={{ position: [0, 0.28, 7.2], fov: 34 }}>
          <color attach="background" args={['#111827']} />
          <ambientLight intensity={0.65} />
          <spotLight position={[5, 7, 6]} angle={0.35} penumbra={0.8} intensity={1.8} />
          <PresentationControls global polar={[-0.25, 0.25]} azimuth={[-0.45, 0.45]}>
            <PortfolioMark />
          </PresentationControls>
          <ContactShadows position={[0, -1.55, 0]} opacity={0.45} scale={6} blur={2.4} far={3} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
      </section>
    </main>
  );
}

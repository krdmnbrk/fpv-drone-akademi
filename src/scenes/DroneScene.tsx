import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { DroneModel } from './DroneModel';

export interface DroneSceneProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  reducedMotion: boolean;
}

/**
 * Lazy-loaded Three.js scene (kept out of the entry bundle). A small image-based
 * environment built from Lightformers (no network) gives the metallic parts
 * realistic reflections; a contact shadow grounds the craft. Auto-rotation and
 * propeller spin are disabled when the user prefers reduced motion.
 */
export default function DroneScene({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  reducedMotion,
}: DroneSceneProps) {
  return (
    <Canvas
      camera={{ position: [2.6, 1.8, 2.6], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onHover(null)}
    >
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#bcd4ff', '#0b1020', 0.45]} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} />
      <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#9ab8ff" />

      {/* Offline image-based lighting so anodized metal / carbon read as such. */}
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 5, 1]}
          scale={[8, 8, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          position={[4, 1.5, 3]}
          scale={[4, 4, 1]}
          color="#bcd4ff"
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          position={[-4, 1, -3]}
          scale={[4, 4, 1]}
          color="#3a5bd0"
        />
      </Environment>

      <DroneModel
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
        reducedMotion={reducedMotion}
      />

      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.45}
        scale={4}
        blur={2.6}
        far={2.2}
        resolution={256}
        color="#000000"
      />

      <OrbitControls
        enablePan={false}
        autoRotate={!reducedMotion && !selectedId}
        autoRotateSpeed={0.7}
        minDistance={2}
        maxDistance={7}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

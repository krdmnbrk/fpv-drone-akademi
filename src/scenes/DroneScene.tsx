import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DroneModel } from './DroneModel';

export interface DroneSceneProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  reducedMotion: boolean;
}

/**
 * Lazy-loaded Three.js scene (kept out of the entry bundle). Auto-rotation and
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
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#bcd4ff', '#16265a', 0.5]} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} castShadow={false} />
      <DroneModel
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
        spin={!reducedMotion}
      />
      <OrbitControls
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.7}
        minDistance={2}
        maxDistance={7}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

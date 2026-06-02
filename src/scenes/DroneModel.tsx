import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export interface DroneModelProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  /** Spin the propellers (disabled when the user prefers reduced motion). */
  spin: boolean;
}

const ACTIVE_COLOR = '#59a6ff';
const ACTIVE_EMISSIVE = '#1f66f0';

interface PartMeshProps {
  partId: string;
  active: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  geometry: ReactNode;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function PartMesh({
  partId,
  active,
  onSelect,
  onHover,
  geometry,
  color,
  position,
  rotation,
}: PartMeshProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(partId);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(partId);
      }}
      onPointerOut={() => onHover(null)}
    >
      {geometry}
      <meshStandardMaterial
        color={active ? ACTIVE_COLOR : color}
        emissive={active ? ACTIVE_EMISSIVE : '#000000'}
        emissiveIntensity={active ? 0.7 : 0}
        metalness={0.35}
        roughness={0.55}
      />
    </mesh>
  );
}

const ARM_POSITIONS: Array<[number, number, number]> = [
  [0.62, 0, 0.62],
  [-0.62, 0, 0.62],
  [0.62, 0, -0.62],
  [-0.62, 0, -0.62],
];

function Propeller({
  position,
  active,
  spin,
  onSelect,
  onHover,
}: {
  position: [number, number, number];
  active: boolean;
  spin: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 6;
    }
  });
  return (
    <group ref={ref} position={position}>
      <PartMesh
        partId="propellers"
        active={active}
        onSelect={onSelect}
        onHover={onHover}
        color="#9aa4b2"
        geometry={<boxGeometry args={[0.62, 0.02, 0.07]} />}
      />
      <PartMesh
        partId="propellers"
        active={active}
        onSelect={onSelect}
        onHover={onHover}
        color="#9aa4b2"
        rotation={[0, Math.PI / 2, 0]}
        geometry={<boxGeometry args={[0.62, 0.02, 0.07]} />}
      />
    </group>
  );
}

/**
 * Stylized procedural quadcopter. Each highlightable part shares a `partId` so
 * selecting/hovering (from the 3D scene or the accessible list) lights it up.
 * On-craft parts only; goggles and the radio are covered in the part list.
 */
export function DroneModel({ selectedId, hoveredId, onSelect, onHover, spin }: DroneModelProps) {
  const isActive = (id: string) => selectedId === id || hoveredId === id;

  return (
    <group rotation={[0.1, 0, 0]}>
      {/* Frame: center plate + 4 arms */}
      <PartMesh
        partId="frame"
        active={isActive('frame')}
        onSelect={onSelect}
        onHover={onHover}
        color="#2b2f36"
        geometry={<boxGeometry args={[0.7, 0.12, 0.7]} />}
      />
      {ARM_POSITIONS.map((pos, index) => (
        <PartMesh
          key={`arm-${index}`}
          partId="frame"
          active={isActive('frame')}
          onSelect={onSelect}
          onHover={onHover}
          color="#23272e"
          position={[pos[0] / 2, 0, pos[2] / 2]}
          rotation={[0, pos[0] * pos[2] > 0 ? -Math.PI / 4 : Math.PI / 4, 0]}
          geometry={<boxGeometry args={[0.9, 0.06, 0.12]} />}
        />
      ))}

      {/* Motors + propellers at each arm end */}
      {ARM_POSITIONS.map((pos, index) => (
        <group key={`motor-${index}`}>
          <PartMesh
            partId="motors"
            active={isActive('motors')}
            onSelect={onSelect}
            onHover={onHover}
            color="#d4582f"
            position={[pos[0], 0.08, pos[2]]}
            geometry={<cylinderGeometry args={[0.12, 0.12, 0.12, 20]} />}
          />
          <Propeller
            position={[pos[0], 0.18, pos[2]]}
            active={isActive('propellers')}
            spin={spin}
            onSelect={onSelect}
            onHover={onHover}
          />
        </group>
      ))}

      {/* Center stack: ESC (bottom), FC (middle), LiPo (top) */}
      <PartMesh
        partId="esc"
        active={isActive('esc')}
        onSelect={onSelect}
        onHover={onHover}
        color="#3b7d4f"
        position={[0, 0.11, 0]}
        geometry={<boxGeometry args={[0.42, 0.05, 0.42]} />}
      />
      <PartMesh
        partId="fc"
        active={isActive('fc')}
        onSelect={onSelect}
        onHover={onHover}
        color="#7a5cc0"
        position={[0, 0.17, 0]}
        geometry={<boxGeometry args={[0.36, 0.05, 0.36]} />}
      />
      <PartMesh
        partId="lipo"
        active={isActive('lipo')}
        onSelect={onSelect}
        onHover={onHover}
        color="#c0a93b"
        position={[0, 0.28, 0]}
        geometry={<boxGeometry args={[0.5, 0.16, 0.3]} />}
      />

      {/* FPV camera at the front */}
      <PartMesh
        partId="fpv-camera"
        active={isActive('fpv-camera')}
        onSelect={onSelect}
        onHover={onHover}
        color="#1b1d22"
        position={[0, 0.18, 0.4]}
        rotation={[0.4, 0, 0]}
        geometry={<boxGeometry args={[0.22, 0.22, 0.18]} />}
      />

      {/* VTX block + antenna at the back */}
      <PartMesh
        partId="vtx"
        active={isActive('vtx')}
        onSelect={onSelect}
        onHover={onHover}
        color="#324a8f"
        position={[0, 0.18, -0.36]}
        geometry={<boxGeometry args={[0.26, 0.08, 0.16]} />}
      />
      <PartMesh
        partId="vtx"
        active={isActive('vtx')}
        onSelect={onSelect}
        onHover={onHover}
        color="#324a8f"
        position={[0, 0.42, -0.42]}
        geometry={<cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />}
      />

      {/* RX + antenna on the side */}
      <PartMesh
        partId="rx"
        active={isActive('rx')}
        onSelect={onSelect}
        onHover={onHover}
        color="#b0563f"
        position={[0.26, 0.16, -0.18]}
        geometry={<boxGeometry args={[0.12, 0.04, 0.12]} />}
      />
      <PartMesh
        partId="rx"
        active={isActive('rx')}
        onSelect={onSelect}
        onHover={onHover}
        color="#b0563f"
        position={[0.36, 0.3, -0.2]}
        geometry={<cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />}
      />
    </group>
  );
}

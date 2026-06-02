import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  Shape,
  TubeGeometry,
  Vector2,
  Vector3,
  type ColorRepresentation,
  type Group,
} from 'three';

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

/* -------------------------------------------------------------------------- */
/*  DRY material + selectable-part helpers                                    */
/* -------------------------------------------------------------------------- */

interface MatProps {
  active: boolean;
  color: ColorRepresentation;
  metalness?: number;
  roughness?: number;
}

/**
 * Shared material. Every selectable surface routes through this, so the
 * highlight rule (emissive `#1f66f0` @ 0.7, tinted color) is defined once.
 */
function Mat({ active, color, metalness = 0.4, roughness = 0.5 }: MatProps) {
  return (
    <meshStandardMaterial
      color={active ? ACTIVE_COLOR : color}
      emissive={active ? ACTIVE_EMISSIVE : '#000000'}
      emissiveIntensity={active ? 0.7 : 0}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

interface SelectHandlers {
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** Pointer handlers shared by every selectable mesh (stopPropagation + route). */
function usePartHandlers(partId: string, { onSelect, onHover }: SelectHandlers) {
  return {
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      onSelect(partId);
    },
    onPointerOver: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      onHover(partId);
    },
    onPointerOut: () => onHover(null),
  };
}

interface PartProps extends SelectHandlers {
  partId: string;
  active: boolean;
  color: ColorRepresentation;
  /** Procedural geometry node, e.g. `<primitive object={geom} attach="geometry" />`. */
  geometry: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  metalness?: number;
  roughness?: number;
}

/**
 * A single selectable mesh wrapping custom geometry. All meshes sharing a
 * `partId` wire identical handlers and obey the same `active` flag, so they
 * light up together from either the canvas or the accessible part list.
 */
function Part({
  partId,
  active,
  color,
  onSelect,
  onHover,
  geometry,
  position,
  rotation,
  scale,
  metalness,
  roughness,
}: PartProps) {
  const handlers = usePartHandlers(partId, { onSelect, onHover });
  return (
    <mesh position={position} rotation={rotation} scale={scale} {...handlers}>
      {geometry}
      <Mat active={active} color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

interface BoxPartProps extends SelectHandlers {
  partId: string;
  active: boolean;
  color: ColorRepresentation;
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  metalness?: number;
  roughness?: number;
}

/**
 * A selectable chamfered box (drei `RoundedBox`) — used for plates, PCBs and
 * the LiPo. Same handler/highlight contract as `Part`.
 */
function BoxPart({
  partId,
  active,
  color,
  args,
  position,
  rotation,
  radius = 0.012,
  metalness,
  roughness,
  onSelect,
  onHover,
}: BoxPartProps) {
  const handlers = usePartHandlers(partId, { onSelect, onHover });
  const [w, h, d] = args;
  return (
    <RoundedBox
      args={[w, h, d]}
      radius={Math.min(radius, h / 2, w / 2, d / 2)}
      smoothness={3}
      position={position}
      rotation={rotation}
      {...handlers}
    >
      <Mat active={active} color={color} metalness={metalness} roughness={roughness} />
    </RoundedBox>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout constants (typed tuples — safe under noUncheckedIndexedAccess)     */
/* -------------------------------------------------------------------------- */

interface ArmSlot {
  /** Motor-hub centre in world space. */
  motor: readonly [number, number, number];
  /** Yaw so the tapered arm points outward along its diagonal. */
  yaw: number;
  /** Prop spin direction (alternating, like a real quad). */
  dir: 1 | -1;
}

const HUB = 0.6; // motor distance from centre along each diagonal
const PLATE_Y = 0.045; // top deck height
const ARM_SLOTS: readonly ArmSlot[] = [
  { motor: [HUB, 0.02, HUB], yaw: Math.PI / 4, dir: 1 },
  { motor: [-HUB, 0.02, HUB], yaw: (3 * Math.PI) / 4, dir: -1 },
  { motor: [-HUB, 0.02, -HUB], yaw: (5 * Math.PI) / 4, dir: 1 },
  { motor: [HUB, 0.02, -HUB], yaw: (7 * Math.PI) / 4, dir: -1 },
];

const STANDOFF_X = 0.27;
const STANDOFF_Z = 0.27;
const STANDOFF_SLOTS: readonly (readonly [number, number])[] = [
  [STANDOFF_X, STANDOFF_Z],
  [-STANDOFF_X, STANDOFF_Z],
  [-STANDOFF_X, -STANDOFF_Z],
  [STANDOFF_X, -STANDOFF_Z],
];

/* -------------------------------------------------------------------------- */
/*  Procedural geometry builders (pure `three`)                               */
/* -------------------------------------------------------------------------- */

/**
 * Minimal positions-only merge (keeps deps to `three`, avoids three-stdlib).
 * Normals are recomputed by callers, so only position is needed. Inputs are
 * de-indexed first so vertex counts line up.
 */
function mergePositions(geoms: readonly BufferGeometry[]): BufferGeometry {
  const positions: number[] = [];
  for (const g of geoms) {
    const src = g.index ? g.toNonIndexed() : g;
    const attr = src.attributes.position;
    if (attr) {
      for (let i = 0; i < attr.count; i += 1) {
        positions.push(attr.getX(i), attr.getY(i), attr.getZ(i));
      }
    }
    if (src !== g) src.dispose();
  }
  const out = new BufferGeometry();
  out.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return out;
}

/** Tapered carbon arm: wide at the frame root, narrowing to a rounded motor mount. */
function makeArmGeometry(): ExtrudeGeometry {
  const rootHalf = 0.085;
  const tipHalf = 0.05;
  const length = 0.64;
  const shape = new Shape();
  shape.moveTo(0, -rootHalf);
  shape.lineTo(0, rootHalf);
  shape.lineTo(length, tipHalf);
  shape.quadraticCurveTo(length + tipHalf, 0, length, -tipHalf);
  shape.closePath();

  const geom = new ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    steps: 1,
  });
  geom.rotateX(-Math.PI / 2); // lay the slab flat
  geom.translate(0, 0.02, 0); // centre thickness around the deck
  geom.computeVertexNormals();
  return geom;
}

/** 2207-style motor bell: domed top, skirt shoulder and a wider stator base. */
function makeMotorGeometry(): LatheGeometry {
  const pts: Vector2[] = [
    new Vector2(0.0, 0.0),
    new Vector2(0.114, 0.0),
    new Vector2(0.114, 0.022),
    new Vector2(0.09, 0.03),
    new Vector2(0.108, 0.04),
    new Vector2(0.108, 0.092),
    new Vector2(0.1, 0.104),
    new Vector2(0.07, 0.116),
    new Vector2(0.032, 0.124),
    new Vector2(0.014, 0.127),
    new Vector2(0.0, 0.127),
  ];
  const geom = new LatheGeometry(pts, 28);
  geom.computeVertexNormals();
  return geom;
}

/**
 * One tri-blade prop: lathed hub + 3 curved, washed-out (twisted) blades merged
 * into a single geometry. Each blade is an extruded plan-form whose
 * cross-sections rotate progressively along the span to fake aerodynamic pitch.
 */
function makePropGeometry(): BufferGeometry {
  const root = 0.05;
  const tip = 0.235;

  const shape = new Shape();
  shape.moveTo(root, -0.018);
  shape.quadraticCurveTo(root + 0.04, 0.052, root + 0.085, 0.05);
  shape.quadraticCurveTo(tip - 0.02, 0.04, tip, 0.012);
  shape.quadraticCurveTo(tip + 0.014, 0.0, tip, -0.014);
  shape.quadraticCurveTo(tip - 0.05, -0.03, root + 0.06, -0.03);
  shape.quadraticCurveTo(root + 0.02, -0.028, root, -0.018);
  shape.closePath();

  const blade = new ExtrudeGeometry(shape, {
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 1,
    steps: 1,
  });
  blade.translate(0, 0, -0.009); // centre slab thickness so twist rotates about the chord

  const pos = blade.attributes.position;
  if (pos) {
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const tNorm = Math.min(1, Math.max(0, (x - root) / (tip - root)));
      const pitch = 0.34 * (1 - tNorm) + 0.12; // more pitch at root, washing out at the tip
      const c = Math.cos(pitch);
      const s = Math.sin(pitch);
      pos.setY(i, y * c - z * s);
      pos.setZ(i, y * s + z * c);
    }
    pos.needsUpdate = true;
  }

  const blades: BufferGeometry[] = [];
  for (let b = 0; b < 3; b += 1) {
    const clone = blade.clone();
    clone.rotateY((b * Math.PI * 2) / 3);
    blades.push(clone);
  }
  blade.dispose();

  const hubPts: Vector2[] = [
    new Vector2(0.0, -0.016),
    new Vector2(0.05, -0.016),
    new Vector2(0.055, 0.0),
    new Vector2(0.045, 0.02),
    new Vector2(0.02, 0.028),
    new Vector2(0.0, 0.028),
  ];
  const hub = new LatheGeometry(hubPts, 20);

  const merged = mergePositions([hub, ...blades]);
  hub.dispose();
  blades.forEach((g) => g.dispose());
  merged.computeVertexNormals();
  return merged;
}

/** Camera front lens element (dark cone) as a short lathe profile. */
function makeLensGeometry(): LatheGeometry {
  const pts: Vector2[] = [
    new Vector2(0.0, 0.0),
    new Vector2(0.05, 0.0),
    new Vector2(0.05, 0.018),
    new Vector2(0.044, 0.05),
    new Vector2(0.028, 0.064),
    new Vector2(0.0, 0.068),
  ];
  const geom = new LatheGeometry(pts, 24);
  geom.computeVertexNormals();
  return geom;
}

/** Gently S-curved antenna mast (coax + heat-shrink look) as a thin tube. */
function makeAntennaGeometry(height: number, bend: number): TubeGeometry {
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(bend * 0.25, height * 0.5, bend * 0.1),
    new Vector3(bend, height, bend * 0.3),
  ]);
  return new TubeGeometry(curve, 16, 0.006, 8, false);
}

/* -------------------------------------------------------------------------- */
/*  Sub-assemblies                                                            */
/* -------------------------------------------------------------------------- */

function Propeller({
  geometry,
  position,
  dir,
  active,
  spin,
  onSelect,
  onHover,
}: SelectHandlers & {
  geometry: BufferGeometry;
  position: [number, number, number];
  dir: number;
  active: boolean;
  spin: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 9 * dir;
    }
  });
  return (
    <group ref={ref} position={position}>
      <Part
        partId="propellers"
        active={active}
        color="#11151b"
        onSelect={onSelect}
        onHover={onHover}
        geometry={<primitive object={geometry} attach="geometry" />}
        metalness={0.2}
        roughness={0.65}
      />
    </group>
  );
}

/** A 2207 motor stack: lathed bell + dark base ring + a little bolt boss. */
function Motor({
  geometry,
  slot,
  active,
  onSelect,
  onHover,
}: SelectHandlers & {
  geometry: BufferGeometry;
  slot: ArmSlot;
  active: boolean;
}) {
  const [mx, my, mz] = slot.motor;
  return (
    <group position={[mx, my, mz]}>
      <Part
        partId="motors"
        active={active}
        color="#c2532b"
        onSelect={onSelect}
        onHover={onHover}
        geometry={<primitive object={geometry} attach="geometry" />}
        metalness={0.75}
        roughness={0.32}
      />
      {/* base / stator ring */}
      <Part
        partId="motors"
        active={active}
        color="#15181d"
        onSelect={onSelect}
        onHover={onHover}
        position={[0, 0.005, 0]}
        geometry={<cylinderGeometry args={[0.118, 0.124, 0.02, 28]} />}
        metalness={0.5}
        roughness={0.6}
      />
      {/* top bolt */}
      <Part
        partId="motors"
        active={active}
        color="#9aa3ad"
        onSelect={onSelect}
        onHover={onHover}
        position={[0, 0.133, 0]}
        geometry={<cylinderGeometry args={[0.015, 0.015, 0.014, 12]} />}
        metalness={0.85}
        roughness={0.3}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Model                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Procedural 5-inch FPV freestyle quad. Each highlightable part shares a
 * `partId` so selecting/hovering (from the 3D scene or the accessible list)
 * lights it up. On-craft parts only; goggles and the radio live in the list.
 */
export function DroneModel({ selectedId, hoveredId, onSelect, onHover, spin }: DroneModelProps) {
  const isActive = (id: string) => selectedId === id || hoveredId === id;

  // Build expensive geometry once; dispose on unmount.
  const armGeo = useMemo(makeArmGeometry, []);
  const motorGeo = useMemo(makeMotorGeometry, []);
  const propGeo = useMemo(makePropGeometry, []);
  const lensGeo = useMemo(makeLensGeometry, []);
  const vtxAntGeo = useMemo(() => makeAntennaGeometry(0.34, 0.06), []);
  const rxAntGeo = useMemo(() => makeAntennaGeometry(0.26, 0.05), []);

  useEffect(() => {
    const geoms = [armGeo, motorGeo, propGeo, lensGeo, vtxAntGeo, rxAntGeo];
    return () => geoms.forEach((g) => g.dispose());
  }, [armGeo, motorGeo, propGeo, lensGeo, vtxAntGeo, rxAntGeo]);

  const frameActive = isActive('frame');
  const motorsActive = isActive('motors');
  const propsActive = isActive('propellers');
  const escActive = isActive('esc');
  const fcActive = isActive('fc');
  const camActive = isActive('fpv-camera');
  const vtxActive = isActive('vtx');
  const rxActive = isActive('rx');
  const lipoActive = isActive('lipo');

  return (
    <group rotation={[0.1, 0, 0]}>
      {/* ===================== FRAME ===================== */}
      {/* 4 tapered arms */}
      {ARM_SLOTS.map((slot, i) => (
        <Part
          key={`arm-${i}`}
          partId="frame"
          active={frameActive}
          color="#1b1f25"
          onSelect={onSelect}
          onHover={onHover}
          rotation={[0, slot.yaw, 0]}
          geometry={<primitive object={armGeo} attach="geometry" />}
          metalness={0.5}
          roughness={0.45}
        />
      ))}
      {/* bottom plate */}
      <BoxPart
        partId="frame"
        active={frameActive}
        color="#23272e"
        args={[0.42, 0.018, 0.42]}
        position={[0, 0.0, 0]}
        radius={0.03}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.4}
        roughness={0.5}
      />
      {/* top plate */}
      <BoxPart
        partId="frame"
        active={frameActive}
        color="#23272e"
        args={[0.4, 0.016, 0.4]}
        position={[0, PLATE_Y, 0]}
        radius={0.03}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.4}
        roughness={0.5}
      />
      {/* 4 aluminium standoffs joining the plates */}
      {STANDOFF_SLOTS.map(([sx, sz], i) => (
        <Part
          key={`standoff-${i}`}
          partId="frame"
          active={frameActive}
          color="#8b94a0"
          onSelect={onSelect}
          onHover={onHover}
          position={[sx, PLATE_Y / 2, sz]}
          geometry={<cylinderGeometry args={[0.013, 0.013, PLATE_Y, 12]} />}
          metalness={0.8}
          roughness={0.35}
        />
      ))}

      {/* ===================== CENTER STACK ===================== */}
      {/* 4-in-1 ESC (lower PCB) */}
      <BoxPart
        partId="esc"
        active={escActive}
        color="#2f6f45"
        args={[0.3, 0.014, 0.3]}
        position={[0, 0.014, 0]}
        radius={0.018}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.3}
        roughness={0.55}
      />
      {/* big electrolytic cap on the ESC */}
      <Part
        partId="esc"
        active={escActive}
        color="#1d2733"
        onSelect={onSelect}
        onHover={onHover}
        position={[0.07, 0.04, 0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={<cylinderGeometry args={[0.028, 0.028, 0.05, 16]} />}
        metalness={0.4}
        roughness={0.4}
      />
      {/* Flight controller (upper PCB) */}
      <BoxPart
        partId="fc"
        active={fcActive}
        color="#6a4fb0"
        args={[0.26, 0.012, 0.26]}
        position={[0, PLATE_Y - 0.006, 0]}
        radius={0.016}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.3}
        roughness={0.55}
      />
      {/* tiny gyro/MCU chip on the FC */}
      <BoxPart
        partId="fc"
        active={fcActive}
        color="#11141a"
        args={[0.06, 0.012, 0.06]}
        position={[0, PLATE_Y + 0.006, 0]}
        radius={0.004}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.2}
        roughness={0.6}
      />

      {/* ===================== MOTORS + PROPS ===================== */}
      {ARM_SLOTS.map((slot, i) => {
        const [mx, my, mz] = slot.motor;
        return (
          <group key={`drive-${i}`}>
            <Motor
              geometry={motorGeo}
              slot={slot}
              active={motorsActive}
              onSelect={onSelect}
              onHover={onHover}
            />
            <Propeller
              geometry={propGeo}
              position={[mx, my + 0.14, mz]}
              dir={slot.dir}
              active={propsActive}
              spin={spin}
              onSelect={onSelect}
              onHover={onHover}
            />
          </group>
        );
      })}

      {/* ===================== FPV CAMERA (front cage, tilted up ~25°) ===== */}
      <group position={[0, PLATE_Y + 0.04, 0.21]} rotation={[-0.44, 0, 0]}>
        {/* side cage rails */}
        {[-0.075, 0.075].map((x) => (
          <BoxPart
            key={`cam-rail-${x}`}
            partId="fpv-camera"
            active={camActive}
            color="#16181d"
            args={[0.014, 0.12, 0.13]}
            position={[x, 0, 0]}
            radius={0.005}
            onSelect={onSelect}
            onHover={onHover}
            metalness={0.5}
            roughness={0.4}
          />
        ))}
        {/* camera body between the rails */}
        <BoxPart
          partId="fpv-camera"
          active={camActive}
          color="#1b1d22"
          args={[0.12, 0.12, 0.1]}
          position={[0, 0, -0.01]}
          radius={0.012}
          onSelect={onSelect}
          onHover={onHover}
          metalness={0.35}
          roughness={0.5}
        />
        {/* lens barrel */}
        <Part
          partId="fpv-camera"
          active={camActive}
          color="#0a0c10"
          onSelect={onSelect}
          onHover={onHover}
          position={[0, 0, 0.05]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={<primitive object={lensGeo} attach="geometry" />}
          metalness={0.4}
          roughness={0.3}
        />
        {/* glass element */}
        <Part
          partId="fpv-camera"
          active={camActive}
          color="#3b6ea5"
          onSelect={onSelect}
          onHover={onHover}
          position={[0, 0, 0.116]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={<cylinderGeometry args={[0.03, 0.03, 0.006, 20]} />}
          metalness={0.1}
          roughness={0.05}
        />
      </group>

      {/* ===================== VTX + DIPOLE ANTENNA (rear) ================= */}
      <BoxPart
        partId="vtx"
        active={vtxActive}
        color="#2c4585"
        args={[0.2, 0.03, 0.14]}
        position={[0, PLATE_Y + 0.02, -0.13]}
        radius={0.01}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.3}
        roughness={0.55}
      />
      {/* antenna SMA base */}
      <Part
        partId="vtx"
        active={vtxActive}
        color="#caa53a"
        onSelect={onSelect}
        onHover={onHover}
        position={[0, PLATE_Y + 0.045, -0.2]}
        geometry={<cylinderGeometry args={[0.014, 0.016, 0.03, 14]} />}
        metalness={0.75}
        roughness={0.35}
      />
      {/* dipole mast (S-curved tube) */}
      <Part
        partId="vtx"
        active={vtxActive}
        color="#1d2230"
        onSelect={onSelect}
        onHover={onHover}
        position={[0, PLATE_Y + 0.06, -0.2]}
        geometry={<primitive object={vtxAntGeo} attach="geometry" />}
        metalness={0.3}
        roughness={0.6}
      />
      {/* heat-shrink active tip */}
      <Part
        partId="vtx"
        active={vtxActive}
        color="#d23b3b"
        onSelect={onSelect}
        onHover={onHover}
        position={[0.06, PLATE_Y + 0.39, -0.182]}
        geometry={<cylinderGeometry args={[0.01, 0.01, 0.05, 10]} />}
        metalness={0.2}
        roughness={0.65}
      />

      {/* ===================== RX + ANTENNA (side) ===================== */}
      <BoxPart
        partId="rx"
        active={rxActive}
        color="#b0563f"
        args={[0.09, 0.018, 0.12]}
        position={[0.16, PLATE_Y - 0.004, -0.04]}
        radius={0.008}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.3}
        roughness={0.55}
      />
      {/* RX whip antenna */}
      <Part
        partId="rx"
        active={rxActive}
        color="#15181d"
        onSelect={onSelect}
        onHover={onHover}
        position={[0.2, PLATE_Y + 0.01, -0.06]}
        geometry={<primitive object={rxAntGeo} attach="geometry" />}
        metalness={0.3}
        roughness={0.6}
      />
      {/* white antenna tip */}
      <Part
        partId="rx"
        active={rxActive}
        color="#e6e9ee"
        onSelect={onSelect}
        onHover={onHover}
        position={[0.245, PLATE_Y + 0.275, -0.045]}
        geometry={<cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />}
        metalness={0.1}
        roughness={0.7}
      />

      {/* ===================== LiPo (on top) ===================== */}
      {/* battery body with a wrap look */}
      <BoxPart
        partId="lipo"
        active={lipoActive}
        color="#1a2740"
        args={[0.34, 0.11, 0.17]}
        position={[0, PLATE_Y + 0.078, -0.01]}
        radius={0.02}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.2}
        roughness={0.45}
      />
      {/* label panel on the wrap */}
      <BoxPart
        partId="lipo"
        active={lipoActive}
        color="#f0c419"
        args={[0.18, 0.06, 0.001]}
        position={[0, PLATE_Y + 0.085, 0.0755]}
        radius={0.0004}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.1}
        roughness={0.6}
      />
      {/* battery strap band across the top */}
      <BoxPart
        partId="lipo"
        active={lipoActive}
        color="#0c0f14"
        args={[0.3, 0.048, 0.026]}
        position={[0, PLATE_Y + 0.082, 0.06]}
        radius={0.006}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.1}
        roughness={0.7}
      />
      <BoxPart
        partId="lipo"
        active={lipoActive}
        color="#0c0f14"
        args={[0.3, 0.048, 0.026]}
        position={[0, PLATE_Y + 0.082, -0.075]}
        radius={0.006}
        onSelect={onSelect}
        onHover={onHover}
        metalness={0.1}
        roughness={0.7}
      />
      {/* XT60 pigtail nub */}
      <Part
        partId="lipo"
        active={lipoActive}
        color="#f0c419"
        onSelect={onSelect}
        onHover={onHover}
        position={[0, PLATE_Y + 0.05, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={<boxGeometry args={[0.05, 0.05, 0.04]} />}
        metalness={0.2}
        roughness={0.55}
      />
    </group>
  );
}

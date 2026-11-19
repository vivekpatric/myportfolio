import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

/**
 * lowpoly_cat_npc.glb, rigged. The head and neck turn toward the cursor, the ears ride on the head,
 * and the tail, ears and chest idle on their own. Put the file in /public/models/.
 */
const MODEL_URL = '/models/lowpoly_cat_npc.glb';

const BODY_TURN = 0.45; // the cat is turned this much, so the head turns back to face you
const TARGET_HEIGHT = 1.75; // the model is scaled to this height

type Pointer = { x: number; y: number; active: boolean };
type Part = { b: THREE.Object3D; base: THREE.Quaternion };

const _a = new THREE.Quaternion();
const _b = new THREE.Quaternion();
const _frameInv = new THREE.Quaternion();
const _r = new THREE.Quaternion();
const _e = new THREE.Euler();

/** Rotation expressed in the cat's own frame: yaw around its up axis, pitch around its side axis, roll around its facing axis. */
const rot = (pitch: number, yaw: number, roll = 0) => _r.setFromEuler(_e.set(pitch, yaw, roll, 'YXZ'));

/** Rotates a bone around its own pivot by `R` (given in the cat's frame), on top of its rest pose. */
function twist({ b, base }: Part, R: THREE.Quaternion) {
  if (!b.parent) return;
  b.parent.getWorldQuaternion(_a).premultiply(_frameInv); // parent, in the cat's frame
  _b.copy(_a).invert();
  b.quaternion.copy(_b).multiply(R).multiply(_a).multiply(base);
  b.updateMatrixWorld(true);
}

function Cat({ pointer }: { pointer: MutableRefObject<Pointer> }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const frame = useRef<THREE.Group>(null);
  const look = useRef({ yaw: 0, pitch: 0, body: BODY_TURN });

  const rig = useMemo(() => {
    const root = cloneSkinned(gltf.scene) as THREE.Object3D;
    root.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) o.frustumCulled = false;
    });
    root.updateWorldMatrix(true, true);

    // fit: stand it on the ground, centred, at TARGET_HEIGHT
    // const box = new THREE.Box3().setFromObject(root, true);
    // const size = box.getSize(new THREE.Vector3());
    // const ok = Number.isFinite(size.y) && size.y > 0.1;
    // const height = ok ? size.y : 1.656;
    // const center = ok ? box.getCenter(new THREE.Vector3()) : new THREE.Vector3(-0.12, 0.83, -0.5);
    // const bottom = ok ? box.min.y : 0;
    // const scale = TARGET_HEIGHT / height;
    // const offset = new THREE.Vector3(-center.x * scale, -bottom * scale, -center.z * scale);
    // 1. In Cat's useMemo, compute an accurate bounding box for skinned meshes:
const box = new THREE.Box3();
root.traverse((o) => {
  if ((o as THREE.SkinnedMesh).isSkinnedMesh) {
    const sm = o as THREE.SkinnedMesh;
    sm.computeBoundingBox();
    if (sm.boundingBox) {
      box.union(sm.boundingBox.clone().applyMatrix4(sm.matrixWorld));
    }
  }
});
if (box.isEmpty()) box.setFromObject(root, true);

const size = box.getSize(new THREE.Vector3());
const ok = Number.isFinite(size.y) && size.y > 0.1;
const height = ok ? size.y : 1.656;
const center = ok ? box.getCenter(new THREE.Vector3()) : new THREE.Vector3(-0.12, 0.83, -0.5);
const bottom = ok ? box.min.y : 0;
const scale = TARGET_HEIGHT / height;
const offset = new THREE.Vector3(-center.x * scale, -bottom * scale, -center.z * scale);

    const find = (name: string) => root.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(name));
    const neck = find('Bip001 Neck_018');
    const head = find('Bip001 Head_019');
    const earBones = [find('Bone009_031'), find('Bone009(mirrored)_033')];
    // In this rig the ears hang off the spine, not the head, so they would stay put while the head turns.
    // attach() re-parents them to the head without moving them.
    if (head) earBones.forEach((ear) => ear && head.attach(ear));

    const part = (o: THREE.Object3D | null | undefined): Part | null => (o ? { b: o, base: o.quaternion.clone() } : null);
    return {
      root,
      scale,
      offset,
      spine: find('Bip001 Spine1_012') ?? null,
      neck: part(neck),
      head: part(head),
      ears: earBones.map(part),
      tail: ['Bone005_035', 'Bone006_036', 'Bone007_037'].map((n) => part(find(n))),
    };
  }, [gltf]);

  useFrame(({ clock, gl }, delta) => {
    const t = clock.elapsedTime;
    const p = pointer.current;
    const g = frame.current;
    if (!g) return;

    // where is the cursor relative to the cat, in -1..1
    let dx: number;
    let dy: number;
    if (p.active) {
      const r = gl.domElement.getBoundingClientRect();
      dx = THREE.MathUtils.clamp((p.x - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      dy = THREE.MathUtils.clamp((p.y - (r.top + r.height * 0.3)) / (window.innerHeight / 2), -1, 1);
    } else {
      // no mouse yet (or touch screen): look around lazily
      dx = Math.sin(t * 0.5) * 0.35;
      dy = Math.sin(t * 0.37) * 0.15;
    }

    // the whole cat leans toward you a little; the head does the rest
    look.current.body = THREE.MathUtils.damp(look.current.body, BODY_TURN + dx * 0.12, 4, delta);
    g.rotation.y = look.current.body;
    look.current.yaw = THREE.MathUtils.damp(look.current.yaw, THREE.MathUtils.clamp(dx - look.current.body, -1.25, 1.25), 5, delta);
    look.current.pitch = THREE.MathUtils.damp(look.current.pitch, THREE.MathUtils.clamp(dy * 0.5, -0.4, 0.5), 6, delta);

    g.updateWorldMatrix(true, false);
    g.getWorldQuaternion(_frameInv).invert();

    // breathing
    rig.spine?.scale.setScalar(1 + Math.sin(t * 1.8) * 0.012);
    rig.spine?.updateMatrixWorld(true);

    // neck first, then head (the head reads the neck's new pose)
    const { yaw, pitch } = look.current;
    if (rig.neck) twist(rig.neck, rot(pitch * 0.35, yaw * 0.35));
    if (rig.head) twist(rig.head, rot(pitch * 0.65, yaw * 0.65));

    // ears flick now and then, mirrored left and right
    const flick = Math.max(0, Math.sin(t * 0.9 + 1.2) - 0.9) * 5;
    rig.ears.forEach((ear, i) => ear && twist(ear, rot(0, 0, (i === 0 ? 1 : -1) * flick * 0.6)));

    // tail sways, each segment a little behind the one before
    rig.tail.forEach((seg, i) => seg && twist(seg, rot(0, Math.sin(t * 1.5 - i * 0.7) * 0.16)));
  });

  return (
    <group ref={frame} rotation={[0, BODY_TURN, 0]}>
      <group position={rig.offset} scale={rig.scale}>
        <primitive object={rig.root} />
      </group>
    </group>
  );
}

/** Soft blob under the cat so it does not float. */
function GroundShadow() {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.5)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} scale={[1.7, 1.4, 1]}>
      <circleGeometry args={[1.3, 40]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} />
    </mesh>
  );
}

export default function CatScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const [visible, setVisible] = useState(true);
  const calm = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  // follow the cursor anywhere on the page
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // stop rendering while scrolled off-screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // return (
  //   <div ref={wrap} className="pr-knot" aria-hidden="true">
  //     <Canvas
  //       dpr={[1, 1.5]}
  //       frameloop={calm ? 'demand' : visible ? 'always' : 'never'}
  //       camera={{ position: [0, 1.0, 7.6], fov: 30 }}
  //       gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
  //       onCreated={({ camera }) => camera.lookAt(0, 0.88, 0)}
  //     >
  //       <ambientLight intensity={1} />
  //       <Suspense fallback={null}>
  //         <GroundShadow />
  //         <Cat pointer={pointer} />
  //       </Suspense>
  //     </Canvas>
  //   </div>
  // );
  // 2. In CatScene, move the camera closer and level with the cat's vertical center:
const midY = TARGET_HEIGHT * 0.2; // 0.875

return (
  <div ref={wrap} className="pr-knot" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
    <Canvas
      dpr={[1, 1.5]}
      frameloop={calm ? 'demand' : visible ? 'always' : 'never'}
      camera={{ position: [2.2, midY, 3.5], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ camera }) => camera.lookAt(0, midY, 0)}
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <GroundShadow />
        <Cat pointer={pointer} />
      </Suspense>
    </Canvas>
  </div>
);
}
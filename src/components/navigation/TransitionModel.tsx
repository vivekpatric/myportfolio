// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame, useLoader } from '@react-three/fiber';
// import { Box3, Vector3, type Group } from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

// function GoldChainModel() {
//   const loaded = useLoader(GLTFLoader, '/models/gold-chain.glb') as GLTF;
//   const rig = useRef<Group>(null);
//   const model = useMemo(() => loaded.scene.clone(true), [loaded.scene]);

//   useEffect(() => {
//     // Normalize the supplied model so it remains visible even if its original
//     // export used an unusually large or small world-space scale.
//     const bounds = new Box3().setFromObject(model);
//     const dimensions = bounds.getSize(new Vector3());
//     const center = bounds.getCenter(new Vector3());
//     const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z, 0.001);
//     const fitScale = 3.7 / largestDimension;
//     model.scale.setScalar(fitScale);
//     model.position.set(-center.x * fitScale, -center.y * fitScale, -center.z * fitScale);
//   }, [model]);

//   useFrame(({ clock }) => {
//     const group = rig.current;
//     if (!group) return;
//     const time = clock.elapsedTime;
//     group.rotation.x = 0.1 + Math.sin(time * 1.9) * 0.22;
//     group.rotation.y = time * 0.62;
//     group.rotation.z = Math.sin(time * 2.2) * 0.22;
//   });

//   return (
//     <group ref={rig}>
//       <primitive object={model} />
//     </group>
//   );
// }

// export default GoldChainModel;

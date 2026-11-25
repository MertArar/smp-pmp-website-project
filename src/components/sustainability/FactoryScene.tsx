"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Box3, Mesh, MeshPhysicalMaterial, NeutralToneMapping, PCFSoftShadowMap, SRGBColorSpace, Vector3 } from "three";

function StudioLight() {
  return <>
    <Environment resolution={128} frames={1} environmentIntensity={.4}>
      <Lightformer intensity={2.5} color="#ffffff" scale={[10, 10, 1]} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Lightformer intensity={1.5} color="#ffffff" scale={[8, 6, 1]} position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer intensity={2} color="#ffffff" scale={[8, 6, 1]} position={[0, 2, 5]} rotation={[0, Math.PI, 0]} />
    </Environment>
    <ambientLight intensity={.2} />
    <directionalLight position={[-3, 5, 3]} intensity={2.8} color="#ffffff" castShadow
      shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3}
      shadow-camera-near={.1} shadow-camera-far={15} shadow-bias={-.0001} shadow-normalBias={.008}
      shadow-autoUpdate={false} shadow-needsUpdate={true} />
    <directionalLight position={[4, 2, -3]} intensity={.4} color="#ffffff" />
  </>;
}

function Factory({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF("/sustainability/fabrika.glb");
  const fitted = useMemo(() => {
    const object = scene.clone(true);
    // Keep the complete GLB hierarchy and the loader's original PBR materials,
    // texture channels/UV transforms, colours, glass transmission and IOR.
    object.traverse(child => {
      if (child instanceof Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        child.castShadow = !materials.every(material => material.opacity === 0 || (material instanceof MeshPhysicalMaterial && material.transmission >= .99));
        child.receiveShadow = true;
      }
    });
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return { object, center, scale: 3.6 / Math.max(size.x, size.y, size.z) };
  }, [scene]);
  useEffect(onReady, [onReady]);
  return <group scale={fitted.scale}>
    <primitive object={fitted.object} position={[-fitted.center.x, -fitted.center.y, -fitted.center.z]} dispose={null} />
  </group>;
}

export default function FactoryScene({ active, reduced, onReady }: {
  active: boolean;
  reduced: boolean;
  onReady: () => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  return <div role="img" aria-label="Interactive SEMPA factory model. Drag to rotate, or use the left and right arrow keys." aria-keyshortcuts="ArrowLeft ArrowRight" tabIndex={0}
    className="size-full cursor-grab rounded-[28px] outline-none select-none focus-visible:ring-2 focus-visible:ring-[#005eff]/50 active:cursor-grabbing md:rounded-[40px]"
    onKeyDown={event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const orbit = controls.current;
      if (orbit) orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() + (event.key === "ArrowLeft" ? -.2 : .2));
    }}>
    <Canvas shadows camera={{ position: [4.6, 3.3, 5.4], fov: 35, near: .1, far: 100 }} dpr={[1, 1.5]} frameloop={active && !reduced ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.shadowMap.type = PCFSoftShadowMap; gl.outputColorSpace = SRGBColorSpace; gl.toneMapping = NeutralToneMapping; gl.toneMappingExposure = 1; }}
      fallback={<span>Interactive 3D factory</span>}>
      <Suspense fallback={null}>
        <StudioLight />
        <Factory onReady={onReady} />
      </Suspense>
      <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={false} enableDamping dampingFactor={.075}
        autoRotate={active && !reduced} autoRotateSpeed={.45} rotateSpeed={.55} minPolarAngle={.65} maxPolarAngle={1.25} />
    </Canvas>
  </div>;
}

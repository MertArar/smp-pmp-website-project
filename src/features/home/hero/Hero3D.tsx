"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEnvironment, useGLTF } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import * as THREE from "three";
import { buildScatterPaths } from "./heroScatterMotion";
import { createPumpMaterialAdapter } from "./pumpMaterials";
import { HOME_PUMPS } from "../product/homePumpCatalog";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const LEGACY_PUMP_URL = "/home/products/models/product02.glb";
const HOME_DEFAULT_PUMP_URL = "/home/products/models/product.glb";
const LEGACY_SCE_URL = "/home/products/models/SCE.glb";
const NEW_SCE_URL = "/home/products/models/sempa-sce.glb";
const DEFAULT_MODEL_URL = NEW_SCE_URL;
const STUDIO_EXR_URL = "/home/products/models/studyo.exr";
const ENABLE_SCE_GTAO = true;
// Reuse immutable trajectories across Strict Mode, model reselection and resize-back.
const scatterPlanCache = new WeakMap<
  THREE.Object3D,
  Map<string, ReturnType<typeof buildScatterPaths>>
>();

function resolveModelUrl(url: string) {
  return url === LEGACY_SCE_URL ||
    url === LEGACY_PUMP_URL ||
    url === HOME_DEFAULT_PUMP_URL
    ? NEW_SCE_URL
    : url;
}

const MODEL_URLS = [...HOME_PUMPS.map((pump) => pump.modelUrl)] as const;

const PRODUCT02_PART_GROUPS = {
  ALT: ["ALT"],
  ORTA: ["ORTA1", "ORTA2", "ORTA3", "ORTA4"],
  SAG: ["SAG1", "SAG2", "SAG3", "SAG4", "SAG5", "SAG6", "SAG7", "SAG8", "SAG9"],
  SOL: [
    "SOL1",
    "SOL2",
    "SOL3",
    "SOL4",
    "SOL5",
    "SOL6",
    "SOL7",
    "SOL8",
    "SOL9",
    "SOL10",
    "SOL11",
    "SOL12",
    "SOL13",
    "SOL14",
    "SOL15",
  ],
  SOMUN: ["SOMUN1", "SOMUN2"],
  UST: ["UST"],
} as const;

const PRODUCT02_PART_NAMES: readonly string[] = Object.values(
  PRODUCT02_PART_GROUPS,
).flat();

const LEGACY_REFERENCE_MAX_DIMENSION = 1.14177408;

const LEGACY_SEED_BY_NAME: Readonly<Record<string, number>> = {
  ALT: 0,
  ORTA1: 3,
  ORTA2: 5,
  ORTA3: 7,
  ORTA4: 9,
  SAG1: 10,
  SAG2: 14,
  SAG3: 15,
  SAG4: 18,
  SAG5: 21,
  SAG6: 23,
  SAG7: 26,
  SAG8: 28,
  SAG9: 30,
  SOL1: 31,
  SOL2: 35,
  SOL3: 36,
  SOL4: 39,
  SOL5: 42,
  SOL6: 43,
  SOL7: 45,
  SOL8: 48,
  SOL9: 51,
  SOL10: 53,
  SOL11: 54,
  SOL12: 56,
  SOL13: 57,
  SOL14: 58,
  SOL15: 59,
  SOMUN1: 60,
  SOMUN2: 62,
  UST: 64,
};

const PUMP_MODEL_SELECT_EVENT = "sempa:pump-model-select";
const HERO_RETURN_EVENT = "sempa:hero-return-default";
const HERO_RETURN_COMPLETE_EVENT = "sempa:hero-return-complete";
const PUMP_ROTATE_START_EVENT = "sempa:pump-rotate-start";
const PUMP_ROTATE_DELTA_EVENT = "sempa:pump-rotate-delta";
const PUMP_ROTATE_END_EVENT = "sempa:pump-rotate-end";

type MutableRef<T> = {
  current: T;
};

type PointerPosition = {
  x: number;
  y: number;
  active: boolean;
};

type Hero3DProps = {
  blastRef: MutableRef<boolean>;
  explosionProgressRef: MutableRef<number>;
  pointerRef: MutableRef<PointerPosition>;
  scrollExplosionRef: MutableRef<number>;
  productReturnExplosionRef: MutableRef<number>;
  journeyProgressRef: MutableRef<number>;
  returningToHeroRef: MutableRef<boolean>;
  selectionReadyRef: MutableRef<boolean>;
};

type ExplodableProductProps = Hero3DProps & {
  modelUrl: string;
  renderProgressRef: MutableRef<number>;
  introPlayedRef: MutableRef<boolean>;
  morphProgressRef: MutableRef<{ progress: number }>;
  transitionRole: "main" | "incoming" | "outgoing";
  onModelReady?: () => void;
  active?: boolean;
};

type ExplodablePart = {
  object: THREE.Object3D;
  originalPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  explodeOffset: THREE.Vector3;
  arcOffset: THREE.Vector3;
  releaseOffset: THREE.Vector3;
  pivotOffset: THREE.Vector3;
  restPivotOffset: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  rotationAmount: number;
  delay: number;
  launchPower: number;
  rotationLag: number;
  flightPath: Float32Array | null;
  parentAxes: THREE.Matrix3;
  inverseParentAxes: THREE.Matrix3;
};

type ExplodablePartSource = {
  object: THREE.Object3D;
  seedIndex: number;
  originalPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  worldCenter: THREE.Vector3;
  pivotCenter: THREE.Vector3;
  partRadius: number;
  collisionHalfSize: THREE.Vector3;
  parentRestInverse: THREE.Matrix4;
};

function pseudoRandom(index: number, seed: number) {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453123;

  return value - Math.floor(value);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

// Baslangictaki ve bitisteki ani hareketi azaltir.
function smootherstep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function getFirstMesh(object: THREE.Object3D): THREE.Mesh | null {
  let firstMesh: THREE.Mesh | null = null;

  object.traverse((child) => {
    if (!firstMesh && child instanceof THREE.Mesh) {
      firstMesh = child;
    }
  });

  return firstMesh;
}

// Shared studio reflections preserve the embedded PBR materials of every pump.
function PumpStudioEnvironment() {
  const getRendererState = useThree((state) => state.get);
  const studio = useEnvironment({
    files: STUDIO_EXR_URL,
  });

  useEffect(() => {
    // Three.js renderer/scene are imperative objects owned by the R3F store.
    const { gl, scene } = getRendererState();
    const previousEnvironment = scene.environment;
    const previousRotation = scene.environmentRotation.clone();

    const previousToneMapping = gl.toneMapping;
    const previousExposure = gl.toneMappingExposure;
    const previousColorSpace = gl.outputColorSpace;

    scene.environment = studio;
    scene.environmentRotation.set(0, Math.PI * 0.35, 0);

    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    return () => {
      scene.environment = previousEnvironment;
      scene.environmentRotation.copy(previousRotation);
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
      gl.outputColorSpace = previousColorSpace;
    };
  }, [getRendererState, studio]);

  return null;
}

// Keep the color pass sharp; contact occlusion only needs half-resolution buffers.
class HalfResolutionGTAOPass extends GTAOPass {
  setSize(width: number, height: number) {
    super.setSize(
      Math.max(1, Math.round(width * 0.5)),
      Math.max(1, Math.round(height * 0.5)),
    );
  }
}

function HeroRenderBudget({ qualityRef }: { qualityRef: MutableRef<boolean> }) {
  const { size, setDpr } = useThree();
  const budget = useRef({ frames: 0, elapsed: 0, cooldown: 0, slowWindows: 0 });
  const ceiling = Math.max(
    0.65,
    Math.min(
      1.25,
      Math.sqrt(2_200_000 / Math.max(1, size.width * size.height)),
    ),
  );
  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, ceiling));
  }, [ceiling, setDpr]);
  useFrame((state, delta) => {
    const sample = budget.current;
    sample.elapsed += Math.min(delta, 0.1);
    sample.cooldown += delta;
    sample.frames++;
    if (sample.elapsed < 1.5) return;
    const fps = sample.frames / sample.elapsed;
    if (process.env.NODE_ENV === "development") {
      state.gl.domElement.dataset.heroFps = fps.toFixed(1);
      state.gl.domElement.dataset.heroDpr = state.viewport.dpr.toFixed(2);
    }
    sample.slowWindows = fps < 42 ? sample.slowWindows + 1 : 0;
    if (sample.cooldown > 4) {
      const current = state.viewport.dpr;
      const floor = Math.max(0.6, ceiling * 0.72);
      if (fps < 50 && current > floor + 0.02) {
        setDpr(Math.max(floor, current - 0.15));
        sample.cooldown = 0;
      } else if (fps > 58 && current < ceiling - 0.02) {
        setDpr(Math.min(ceiling, current + 0.1));
        sample.cooldown = 0;
      }
      if (sample.slowWindows >= 2 && current <= floor + 0.02)
        qualityRef.current = false;
    }
    sample.frames = 0;
    sample.elapsed = 0;
  });
  return null;
}

function HeroStartupWarmup() {
  const { gl, scene, camera } = useThree();
  const compiled = useRef(false);
  const frames = useRef(0);
  const signaled = useRef(false);
  useEffect(() => {
    let disposed = false;
    // Prepare GPU programs while the lightweight startup screen is visible.
    void gl.compileAsync(scene, camera).catch(() => {}).finally(() => {
      if (!disposed) compiled.current = true;
    });
    return () => { disposed = true; };
  }, [gl, scene, camera]);
  useFrame(() => {
    if (signaled.current || !compiled.current) return;
    if (++frames.current < 2) return;
    signaled.current = true;
    document.documentElement.dataset.heroReady = "true";
    window.dispatchEvent(new Event("sempa:hero-ready"));
  }, 2);
  return null;
}

function SceContactShadows({
  progressRef,
  qualityRef,
  enabled = true,
}: {
  progressRef: MutableRef<number>;
  qualityRef: MutableRef<boolean>;
  enabled?: boolean;
}) {
  const { gl, scene, camera, size, viewport } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const gtaoRef = useRef<GTAOPass | null>(null);

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      samples: 2,
      type: THREE.HalfFloatType,
    });
    const composer = new EffectComposer(gl, renderTarget);
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
    composer.addPass(new RenderPass(scene, camera));
    const gtao = new HalfResolutionGTAOPass(scene, camera, 1, 1);
    gtao.updateGtaoMaterial({
      radius: 0.18,
      distanceExponent: 1.5,
      thickness: 1.2,
      scale: 1,
      samples: 6,
    });
    gtao.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 4,
      rings: 2,
      samples: 4,
    });
    gtao.blendIntensity = 0.85;
    composer.addPass(gtao);
    const output = new OutputPass();
    const source = "gl_FragColor = texture2D( tDiffuse, vUv );";
    if (output.material.fragmentShader.includes(source)) {
      output.material.fragmentShader = output.material.fragmentShader
        .replace(
          source,
          source +
            " float onAlfa = gl_FragColor.a; if ( onAlfa > 0.0 ) gl_FragColor.rgb /= onAlfa;",
        )
        .replace(/}\s*$/, "\tgl_FragColor.rgb *= onAlfa;\n}");
      output.material.needsUpdate = true;
    }
    composer.addPass(output);
    composerRef.current = composer;
    gtaoRef.current = gtao;
    return () => {
      composerRef.current = null;
      gtaoRef.current = null;
      composer.dispose();
      gtao.dispose();
      output.dispose();
    };
    // Dimensions and DPR are synchronized below, without recreating shaders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composerRef.current?.setPixelRatio(gl.getPixelRatio());
    composerRef.current?.setSize(size.width, size.height);
  }, [gl, size.width, size.height, viewport.dpr]);

  useFrame((_, delta) => {
    const gtao = gtaoRef.current;
    if (gtao) {
      gtao.blendIntensity = 0.85 * (1 - smoothstep(progressRef.current / 0.28));
      // Separated parts have no contact surfaces. Skip the entire normal/AO/
      // denoise pipeline during flight, retaining the original studio materials.
      gtao.enabled = enabled && qualityRef.current && gtao.blendIntensity > 0.005;
    }
    if (composerRef.current) composerRef.current.render(delta);
    else gl.render(scene, camera);
  }, 1);
  return null;
}

function ExplodableProduct({
  modelUrl,
  blastRef,
  explosionProgressRef,
  pointerRef,
  scrollExplosionRef,
  productReturnExplosionRef,
  journeyProgressRef,
  returningToHeroRef,
  selectionReadyRef,
  renderProgressRef,
  introPlayedRef,
  morphProgressRef,
  transitionRole,
  onModelReady,
  active = true,
}: ExplodableProductProps) {
  const { scene } = useGLTF(modelUrl);
  const { scene: heroMaterialSource } = useGLTF(DEFAULT_MODEL_URL);
  const { viewport, size, gl, camera } = useThree();

  const isGroupedPump = modelUrl === NEW_SCE_URL;
  const isOutgoing = transitionRole === "outgoing";
  const initialAssemblyEligibleRef = useRef(
    isGroupedPump &&
      transitionRole === "main" &&
      !introPlayedRef.current &&
      typeof window !== "undefined" &&
      window.scrollY < window.innerHeight * 0.3 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const initialAssemblyTimeRef = useRef(0);

  useEffect(() => {
    if (isGroupedPump && transitionRole === "main")
      introPlayedRef.current = true;
  }, [isGroupedPump, introPlayedRef, transitionRole]);

  useEffect(() => {
    onModelReady?.();
  }, [onModelReady]);

  const rootRef = useRef<THREE.Group | null>(null);
  const shadowRootRef = useRef<THREE.Group | null>(null);

  const blastProgress = useRef(initialAssemblyEligibleRef.current ? 1 : 0);
  const manualBlastProgress = useRef(0);
  const lastPartsPose = useRef({
    parts: null as ExplodablePart[] | null,
    progress: -1,
  });
  const modelEntryRef = useRef(0);

  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempPivot = useMemo(() => new THREE.Vector3(), []);
  const scatterViewRotation = useMemo(() => new THREE.Matrix3(), []);
  const scatterParentRotation = useMemo(() => new THREE.Matrix3(), []);
  const scatterRootMatrix = useMemo(() => new THREE.Matrix4(), []);
  const scatterReferenceMatrix = useMemo(
    () =>
      new THREE.Matrix3().setFromMatrix4(
        new THREE.Matrix4().makeRotationFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(8),
            THREE.MathUtils.degToRad(-30),
            THREE.MathUtils.degToRad(-3),
          ),
        ),
      ),
    [],
  );
  const pointerYawRef = useRef(0);
  const previousScrollYRef = useRef<number | null>(null);
  const scrollSpinRef = useRef(0);
  const hoverProbe = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
      inverse: new THREE.Matrix4(),
      ray: new THREE.Ray(),
    }),
    [],
  );

  const AUTO_ROTATION_SPEED = 0.045;
  const HOVER_ROTATION_MULTIPLIER = 1.08;
  const ROTATION_ACCELERATION = 4;
  const MOUSE_TILT_AMOUNT = 0.2;

  // A short mechanical release leads into a longer, slowing flight.
  const BLAST_OPEN_SPEED = 1.25;
  const BLAST_CLOSE_SPEED = 3.8;
  const SCROLL_BLAST_SPEED = 4.8;
  // Exploded pieces and their assembly rotate faster after the release.
  const EXPLODED_ROTATION_MULTIPLIER = 3.4;
  const RETURN_BLAST_SPEED = 1.5;
  const POINTER_TILT_FADE = 0.25;

  const MANUAL_ROTATION_SENSITIVITY = 0.014;

  const autoRotationRef = useRef(THREE.MathUtils.degToRad(-30));

  const manualPitchRef = useRef(0);

  const currentRotationSpeedRef = useRef(AUTO_ROTATION_SPEED);

  const manualDraggingRef = useRef(false);

  const referenceMaxDimension = LEGACY_REFERENCE_MAX_DIMENSION;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[Hero3D] Yuklenen 3D model:", modelUrl);

      console.info("[Hero3D] Orijinal GLB node sayisi:", scene.children.length);
    }
  }, [modelUrl, scene]);

  const model = useMemo(() => {
    const clonedModel = scene.clone(true);
    const adapter = modelUrl.startsWith("/3d/pumps/") ? createPumpMaterialAdapter(heroMaterialSource) : null;
    clonedModel.userData.disposePumpTextures = adapter?.dispose;

    const materials = new Map<THREE.Material, THREE.Material>();
    const cloneOriginalMaterial = (material: THREE.Material) => {
      let clone = materials.get(material);
      if (!clone) {
        clone = adapter ? adapter.adapt(material) : material.clone();
        // The seven CAD exports mark painted/metal body materials as BLEND.
        // GLTFLoader consequently disables depth writes and sorts whole mesh
        // objects as transparent surfaces, exposing internals and triangular
        // overlaps. These pump solids are opaque; retain their original PBR
        // maps/colors and fix only the exported alpha/depth classification.
        if (modelUrl.startsWith("/3d/pumps/") && clone.transparent) {
          clone.transparent = false;
          clone.opacity = 1;
          clone.depthWrite = true;
          clone.depthTest = true;
          clone.alphaTest = 0;
          clone.needsUpdate = true;
        }
        materials.set(material, clone);
      }
      return clone;
    };

    clonedModel.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (modelUrl === NEW_SCE_URL) {
        child.updateMatrix();
        child.matrixAutoUpdate = false;
      }
      if (Array.isArray(child.material)) {
        child.material = child.material.map(cloneOriginalMaterial);
      } else {
        child.material = cloneOriginalMaterial(child.material);
      }
    });

    return clonedModel;
  }, [scene, modelUrl, heroMaterialSource]);

  useEffect(
    () => () => {
      // Geometry and textures belong to the GLTF cache; only our material clones are owned here.
      const materials = new Set<THREE.Material>();
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => materials.add(material));
        }
      });
      materials.forEach((material) => material.dispose());
      model.userData.disposePumpTextures?.();
    },
    [model],
  );

  // Pompa donerken zemindeki golgenin
  // pompayla birlikte donmesini engelle.
  const detachedShadow = useMemo(() => {
    if (modelUrl !== NEW_SCE_URL) return null;

    const shadow = model.getObjectByName("zemin_golgesi");

    if (!shadow) return null;

    shadow.visible = false;

    const separate = shadow.clone(true);
    separate.visible = true;

    return separate;
  }, [model, modelUrl]);

  // Krom yuzey icin ek RoomEnvironment.
  useEffect(() => {
    if (modelUrl !== NEW_SCE_URL) return;

    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();

    const roomTarget = pmrem.fromScene(room, 0.04);

    const patchedMaterials = new Set<THREE.MeshStandardMaterial>();

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (material.name !== "Oturma yuzu krom") {
          continue;
        }

        const metal = material as THREE.MeshStandardMaterial;

        metal.envMap = roomTarget.texture;
        metal.needsUpdate = true;

        patchedMaterials.add(metal);
      }
    });

    return () => {
      patchedMaterials.forEach((material) => {
        material.envMap = null;
        material.needsUpdate = true;
      });

      roomTarget.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, model, modelUrl]);

  const modelBaseData = useMemo(() => {
    model.updateMatrixWorld(true);

    // Reuse GLTFLoader's accessor bounds: no repeated walks over 300k vertices.
    // Conservative boxes also keep the collision envelopes outside the geometry.
    const meshBounds = new Map<THREE.Object3D, THREE.Box3>();
    model.traverse((child) => {
      if (child instanceof THREE.Mesh)
        meshBounds.set(child, new THREE.Box3().setFromObject(child));
    });
    const restBounds = (object: THREE.Object3D) => {
      const box = new THREE.Box3();
      object.traverse((child) => {
        const cached = meshBounds.get(child);
        if (cached) box.union(cached);
      });
      return box;
    };
    const modelBox = new THREE.Box3();

    if (modelUrl === NEW_SCE_URL) {
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        if (child.name === "zemin_golgesi") {
          return;
        }

        modelBox.union(meshBounds.get(child)!);
      });
    } else {
      modelBox.copy(restBounds(model));
    }

    const modelCenter = modelBox.getCenter(new THREE.Vector3());

    const modelSize = modelBox.getSize(new THREE.Vector3());

    const diagonal = modelSize.length();

    const maxDimension = Math.max(
      modelSize.x,
      modelSize.y,
      modelSize.z,
      0.0001,
    );

    const fitScale = referenceMaxDimension / maxDimension;

    const allMeshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        allMeshes.push(child);
      }
    });

    // Isimlendirilmis grup node'larini kullan.
    // SOL12 ve SOL13 yeni GLB'de bos.
    const explosionObjects: THREE.Object3D[] = (() => {
      if (!isGroupedPump) {
        return allMeshes;
      }

      const missingNames = PRODUCT02_PART_NAMES.filter(
        (name) => !model.getObjectByName(name),
      );

      if (missingNames.length > 0) {
        console.warn("GLB icinde bulunamayan parcalar:", missingNames);
      }

      return PRODUCT02_PART_NAMES.flatMap((name) => {
        const object = model.getObjectByName(name);

        return object && getFirstMesh(object) ? [object] : [];
      });
    })();

    const originalParts: ExplodablePartSource[] = explosionObjects.map(
      (object, index) => {
        const sourceMesh = isGroupedPump ? getFirstMesh(object) : null;

        const originalMeshIndex = sourceMesh
          ? allMeshes.indexOf(sourceMesh)
          : index;

        const seedIndex = isGroupedPump
          ? (LEGACY_SEED_BY_NAME[object.name] ?? originalMeshIndex)
          : originalMeshIndex >= 0
            ? originalMeshIndex
            : index;

        const objectBox = restBounds(sourceMesh ?? object);
        const fullPartBox = restBounds(object);
        const inversePart = object.matrixWorld.clone().invert();
        const localBox = new THREE.Box3();
        object.traverse((child) => {
          if (!(child instanceof THREE.Mesh) || !child.geometry.boundingBox)
            return;
          localBox.union(
            child.geometry.boundingBox
              .clone()
              .applyMatrix4(inversePart.clone().multiply(child.matrixWorld)),
          );
        });
        const pivotCenter = fullPartBox.getCenter(new THREE.Vector3());
        const localPivot = pivotCenter.clone().applyMatrix4(inversePart);
        const centerOffset = localBox
          .getCenter(new THREE.Vector3())
          .sub(localPivot);
        const collisionHalfSize = localBox
          .getSize(new THREE.Vector3())
          .multiplyScalar(0.5);
        collisionHalfSize.x =
          (collisionHalfSize.x + Math.abs(centerOffset.x)) *
          Math.abs(object.scale.x);
        collisionHalfSize.y =
          (collisionHalfSize.y + Math.abs(centerOffset.y)) *
          Math.abs(object.scale.y);
        collisionHalfSize.z =
          (collisionHalfSize.z + Math.abs(centerOffset.z)) *
          Math.abs(object.scale.z);
        object.matrixAutoUpdate = true;

        return {
          object,
          seedIndex,
          originalPosition: object.position.clone(),
          originalQuaternion: object.quaternion.clone(),
          worldCenter: objectBox.getCenter(new THREE.Vector3()),
          pivotCenter,
          collisionHalfSize,
          partRadius: fullPartBox.getSize(new THREE.Vector3()).length() * 0.5,
          // Cache the unanimated parent transform before the model is attached
          // to its moving/scaling hero root. Responsive recalculation must not
          // derive flight distances from the current frame's world matrix.
          parentRestInverse:
            object.parent?.matrixWorld.clone().invert() ?? new THREE.Matrix4(),
        };
      },
    );

    return {
      modelCenter,
      diagonal,
      fitScale,
      originalParts,
      hoverMeshes: allMeshes.filter(
        (mesh) => mesh.name !== "zemin_golgesi" && mesh.visible,
      ),
    };
  }, [model, modelUrl, isGroupedPump, referenceMaxDimension]);

  const modelData = useMemo(() => {
    const { modelCenter, diagonal, fitScale, originalParts } = modelBaseData;

    const parts: ExplodablePart[] = [];

    const initialHeroRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(8),
        THREE.MathUtils.degToRad(-30),
        THREE.MathUtils.degToRad(-3),
      ),
    );

    const inverseHeroRotation = initialHeroRotation.clone().invert();

    const heroDisplayScale =
      (size.width < 1024
        ? viewport.width * 0.78
        : Math.min(2.02, Math.max(1.14, viewport.width * 0.305))) * fitScale;

    const cameraDistance = 6.6;

    const halfScreenWidth = viewport.width / (2 * heroDisplayScale);

    const halfScreenHeight = viewport.height / (2 * heroDisplayScale);

    originalParts.forEach(
      ({
        object,
        seedIndex,
        originalPosition,
        originalQuaternion,
        worldCenter,
        pivotCenter,
        partRadius,
        parentRestInverse,
      }) => {
        const isFastener = object.name.startsWith("SOMUN");
        const isSide =
          object.name.startsWith("SAG") || object.name.startsWith("SOL");
        const isCover = object.name === "UST" || object.name === "ALT";
        const isCore = object.name.startsWith("ORTA");
        const massRatio = clamp01(partRadius / Math.max(diagonal, 0.0001));
        const flightOrigin = isGroupedPump ? pivotCenter : worldCenter;

        let targetWorld: THREE.Vector3;

        if (isGroupedPump) {
          const preferredSide =
            object.name === "UST" || object.name.startsWith("SAG")
              ? 1
              : object.name === "ALT" || object.name.startsWith("SOL")
                ? -1
                : pseudoRandom(seedIndex, 3) >= 0.5
                  ? 1
                  : -1;

          // Keep opposite assemblies on their own side so their separation reads clearly.
          const side = preferredSide;
          const verticalSign =
            object.name === "UST"
              ? 1
              : object.name === "ALT"
                ? -1
                : pseudoRandom(seedIndex, 19) > 0.5
                  ? 1
                  : -1;

          const startingScreenPosition = flightOrigin
            .clone()
            .sub(modelCenter)
            .applyQuaternion(initialHeroRotation);

          // A compact exploded view keeps the rotor and shaft near the center,
          // with the two castings framing them instead of emptying the viewport.
          const targetScreenZ = THREE.MathUtils.clamp(
            startingScreenPosition.z * 0.35 +
              (pseudoRandom(seedIndex, 21) - 0.5) * diagonal * 0.28,
            -diagonal * 0.25,
            diagonal * 0.18,
          );
          const perspectiveFactor = THREE.MathUtils.clamp(
            (cameraDistance - targetScreenZ * heroDisplayScale) /
              cameraDistance,
            0.65,
            1.25,
          );
          const availableX = halfScreenWidth * perspectiveFactor * 0.83;
          const availableY = halfScreenHeight * perspectiveFactor * 0.68;
          const horizontalSpread = isCover
            ? 0.43
            : isCore
              ? 0.1 + pseudoRandom(seedIndex, 17) * 0.2
              : 0.24 + pseudoRandom(seedIndex, 17) * 0.5;
          const verticalSpread = isCover
            ? 0.52
            : isCore
              ? 0.08 + pseudoRandom(seedIndex, 20) * 0.23
              : 0.16 + pseudoRandom(seedIndex, 20) * 0.63;
          const targetScreenX = side * availableX * horizontalSpread;
          const targetScreenY = verticalSign * availableY * verticalSpread;

          targetWorld = new THREE.Vector3(
            targetScreenX,
            targetScreenY,
            targetScreenZ,
          )
            .applyQuaternion(inverseHeroRotation)
            .add(modelCenter);
        } else {
          // Diger GLB modellerinin dagilimi.
          const direction = worldCenter.clone().sub(modelCenter);

          if (direction.lengthSq() < 0.000001) {
            direction.set(
              pseudoRandom(seedIndex, 1) - 0.5,
              pseudoRandom(seedIndex, 2) - 0.5,
              pseudoRandom(seedIndex, 3) - 0.5,
            );
          }

          direction.x *= 1.55;
          direction.y *= 1.55;
          direction.z *= 0.1;

          const screenJitter = new THREE.Vector3(
            (pseudoRandom(seedIndex, 4) - 0.5) * 1.15,
            (pseudoRandom(seedIndex, 5) - 0.5) * 1.1,
            (pseudoRandom(seedIndex, 6) - 0.5) * 0.08,
          );

          direction.add(screenJitter).normalize();

          const distance = diagonal * (0.5 + pseudoRandom(seedIndex, 7) * 0.95);

          targetWorld = worldCenter
            .clone()
            .addScaledVector(direction, distance);
        }

        let explodeOffset = new THREE.Vector3();

        let arcOffset = new THREE.Vector3();
        const releaseOffset = new THREE.Vector3();
        const restPivotOffset = pivotCenter
          .clone()
          .applyMatrix4(parentRestInverse)
          .sub(originalPosition);
        const pivotOffset = restPivotOffset
          .clone()
          .applyQuaternion(originalQuaternion.clone().invert());

        if (object.parent) {
          const startLocal = flightOrigin
            .clone()
            .applyMatrix4(parentRestInverse);

          const endLocal = targetWorld.clone().applyMatrix4(parentRestInverse);

          explodeOffset = endLocal.sub(startLocal);

          if (isGroupedPump) {
            const flightScreen = targetWorld
              .clone()
              .sub(flightOrigin)
              .applyQuaternion(initialHeroRotation);

            // First pull each assembly free, then let it fan out into its flight path.
            const releaseDirection = flightOrigin
              .clone()
              .sub(modelCenter)
              .applyQuaternion(initialHeroRotation);
            if (isCover) {
              releaseDirection.set(0, object.name === "UST" ? 1 : -1, 0.18);
            } else {
              releaseDirection.set(
                object.name.startsWith("SAG")
                  ? 1
                  : object.name.startsWith("SOL")
                    ? -1
                    : flightScreen.x >= 0
                      ? 1
                      : -1,
                (releaseDirection.y / Math.max(diagonal, 0.0001)) * 0.35,
                releaseDirection.z >= 0 ? 0.22 : -0.22,
              );
            }
            const releaseWorld = releaseDirection
              .normalize()
              .multiplyScalar(
                diagonal * (isFastener ? 0.13 : isCore ? 0.055 : 0.085),
              )
              .applyQuaternion(inverseHeroRotation);
            releaseOffset
              .copy(flightOrigin)
              .add(releaseWorld)
              .applyMatrix4(parentRestInverse)
              .sub(startLocal);

            const tangent = new THREE.Vector3(
              -flightScreen.y,
              flightScreen.x,
              0,
            );

            if (tangent.lengthSq() > 0.000001) {
              const arcStrength = Math.min(
                diagonal * 0.19,
                flightScreen.length() *
                  (0.1 + pseudoRandom(seedIndex, 33) * 0.1),
              );

              const arcSign = pseudoRandom(seedIndex, 34) > 0.5 ? 1 : -1;

              const worldArc = tangent
                .normalize()
                .multiplyScalar(arcStrength * arcSign);
              worldArc.y +=
                diagonal * (0.025 + pseudoRandom(seedIndex, 36) * 0.035);
              worldArc.z +=
                diagonal * (pseudoRandom(seedIndex, 37) - 0.5) * 0.18;
              worldArc.applyQuaternion(inverseHeroRotation);

              const midLocal = flightOrigin
                .clone()
                .add(worldArc)
                .applyMatrix4(parentRestInverse);

              arcOffset = midLocal.sub(startLocal);
            }
          }
        }

        const rotationAxis = new THREE.Vector3(
          pseudoRandom(seedIndex, 8) - 0.5,
          pseudoRandom(seedIndex, 9) - 0.5,
          pseudoRandom(seedIndex, 10) - 0.5,
        );

        if (rotationAxis.lengthSq() < 0.001) {
          rotationAxis.set(0, 1, 0);
        }

        rotationAxis.normalize();

        // Light hardware tumbles; the heavier castings retain a sense of weight.
        const rotationDegrees = !isGroupedPump
          ? 14 + pseudoRandom(seedIndex, 11) * 52
          : isFastener
            ? 120 + pseudoRandom(seedIndex, 11) * 105
            : isSide
              ? 38 + pseudoRandom(seedIndex, 11) * 62
              : isCover
                ? 20 + pseudoRandom(seedIndex, 11) * 26
                : 18 + pseudoRandom(seedIndex, 11) * 28;

        const rotationAmount =
          THREE.MathUtils.degToRad(rotationDegrees) *
          (pseudoRandom(seedIndex, 12) > 0.5 ? 1 : -1);

        // AYRILMA SIRASI:
        // Baglanti parcalari erken,
        // yan parcalar ardindan,
        // agir govde biraz daha gec.
        const releaseBase = isFastener
          ? 0.008
          : isSide
            ? 0.075
            : isCover
              ? 0.16
              : isCore
                ? 0.23
                : 0.11;

        const delay = isGroupedPump
          ? releaseBase +
            pseudoRandom(seedIndex, 13) * 0.045 +
            massRatio * 0.035
          : pseudoRandom(seedIndex, 13) * 0.075;

        // Keep every assembly in a decelerating flight. Values above one made
        // the heavier castings accelerate late and look as if they changed
        // their mind after the initial blast.
        const launchPower =
          0.62 + massRatio * 0.22 + pseudoRandom(seedIndex, 35) * 0.08;

        const rotationLag = isFastener ? 0.025 : isSide ? 0.055 : 0.09;

        parts.push({
          object,
          originalPosition,
          originalQuaternion,
          explodeOffset,
          arcOffset,
          releaseOffset,
          pivotOffset,
          restPivotOffset,
          rotationAxis,
          rotationAmount,
          delay,
          launchPower,
          rotationLag,
          flightPath: null,
          parentAxes: new THREE.Matrix3().setFromMatrix4(
            parentRestInverse.clone().invert(),
          ),
          inverseParentAxes: new THREE.Matrix3().setFromMatrix4(
            parentRestInverse,
          ),
        });
      },
    );

    if (isGroupedPump) {
      const screenToModel = new THREE.Matrix4().makeRotationFromQuaternion(
        inverseHeroRotation,
      );
      screenToModel.setPosition(modelCenter);
      const flights = parts.map((part, index) => {
        const source = originalParts[index];
        const parentToWorld = new THREE.Matrix3().setFromMatrix4(
          source.parentRestInverse.clone().invert(),
        );
        const toScreen = (offset: THREE.Vector3) =>
          offset
            .clone()
            .applyMatrix3(parentToWorld)
            .applyQuaternion(initialHeroRotation);
        const origin = source.pivotCenter
          .clone()
          .sub(modelCenter)
          .applyQuaternion(initialHeroRotation);
        return {
          origin,
          destination: origin.clone().add(toScreen(part.explodeOffset)),
          release: toScreen(part.releaseOffset),
          arc: toScreen(part.arcOffset),
          radius: source.partRadius,
          halfSize: source.collisionHalfSize,
          basis: new THREE.Matrix3().setFromMatrix4(
            new THREE.Matrix4()
              .makeRotationFromQuaternion(initialHeroRotation)
              .multiply(source.parentRestInverse.clone().invert())
              .multiply(
                new THREE.Matrix4().makeRotationFromQuaternion(
                  part.originalQuaternion,
                ),
              ),
          ),
          rotationAxis: part.rotationAxis,
          rotationAmount: part.rotationAmount,
          rotationLag: part.rotationLag,
          frameWidth:
            halfScreenWidth *
            (part.object.name === "UST" || part.object.name === "ALT"
              ? 1.12
              : 0.91),
          frameHeight:
            halfScreenHeight *
            (part.object.name === "UST" || part.object.name === "ALT"
              ? 0.92
              : 0.82),
          frameDepth: Math.min(diagonal * 0.35, halfScreenWidth * 0.85),
          delay: part.delay,
          launchPower: part.launchPower,
          toParent: source.parentRestInverse.clone().multiply(screenToModel),
          restPivot: part.restPivotOffset,
        };
      });
      let cache = scatterPlanCache.get(scene);
      if (!cache) {
        cache = new Map();
        scatterPlanCache.set(scene, cache);
      }
      const cacheKey = `${viewport.width.toFixed(4)}:${viewport.height.toFixed(4)}:${size.width < 1024}`;
      let planned = cache.get(cacheKey);
      if (!planned) {
        planned = buildScatterPaths(flights, diagonal);
        if (cache.size >= 4) cache.delete(cache.keys().next().value ?? "");
        cache.set(cacheKey, planned);
      }
      parts.forEach((part, index) => {
        part.flightPath = planned.paths[index];
      });
      // Compact paths preserve full-size geometry without a camera pullback.
    }
    return { parts, center: modelCenter, fitScale };
  }, [
    modelBaseData,
    scene,
    isGroupedPump,
    viewport.width,
    viewport.height,
    size.width,
  ]);

  // Product.tsx rotation event'leri.
  useEffect(() => {
    const handleRotateStart = () => {
      manualDraggingRef.current = true;
    };

    const handleRotateDelta = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          deltaX?: number;
          deltaY?: number;
        }>
      ).detail;

      const deltaX = detail?.deltaX ?? 0;

      const deltaY = detail?.deltaY ?? 0;

      autoRotationRef.current += deltaX * MANUAL_ROTATION_SENSITIVITY;

      manualPitchRef.current += deltaY * MANUAL_ROTATION_SENSITIVITY;
    };

    const handleRotateEnd = () => {
      manualDraggingRef.current = false;

      autoRotationRef.current =
        THREE.MathUtils.euclideanModulo(
          autoRotationRef.current + Math.PI,
          Math.PI * 2,
        ) - Math.PI;

      manualPitchRef.current =
        THREE.MathUtils.euclideanModulo(
          manualPitchRef.current + Math.PI,
          Math.PI * 2,
        ) - Math.PI;
    };

    window.addEventListener(PUMP_ROTATE_START_EVENT, handleRotateStart);

    window.addEventListener(PUMP_ROTATE_DELTA_EVENT, handleRotateDelta);

    window.addEventListener(PUMP_ROTATE_END_EVENT, handleRotateEnd);

    return () => {
      window.removeEventListener(PUMP_ROTATE_START_EVENT, handleRotateStart);

      window.removeEventListener(PUMP_ROTATE_DELTA_EVENT, handleRotateDelta);

      window.removeEventListener(PUMP_ROTATE_END_EVENT, handleRotateEnd);
    };
  }, []);

  const heroModelX =
    size.width >= 1536
      ? viewport.width * 0.03
      : size.width >= 1280
        ? viewport.width * 0.04
        : size.width >= 1024
          ? viewport.width * 0.05
          : size.width >= 768
            ? viewport.width * 0.06
            : viewport.width * -0.015;

  const heroModelY =
    size.width >= 1536
      ? 0.14
      : size.width >= 1280
        ? 0.11
        : size.width >= 1024
          ? 0.08
          : size.width >= 768
            ? 0.04
            : 0.06;

  const HERO_OFFSET_X = -viewport.width * 0.015;

  const HERO_OFFSET_Y = -viewport.height * 0.025;

  const heroPositionX = size.width < 1024 ? 0 : heroModelX + HERO_OFFSET_X;

  const heroPositionY =
    size.width < 1024 ? -viewport.height * 0.055 : heroModelY + HERO_OFFSET_Y;

  const heroModelScale =
    size.width < 1024
      ? viewport.width * 0.78
      : Math.min(2.02, Math.max(1.14, viewport.width * 0.305));

  const productModelX = -viewport.width * 0.008;

  const productModelY =
    size.width >= 1536
      ? viewport.height * 0.08
      : size.width >= 1280
        ? viewport.height * 0.08
        : size.width >= 1024
          ? viewport.height * 0.08
          : size.width >= 768
            ? viewport.height * 0.1
            : viewport.height * 0.1;

  const isTablet = size.width >= 768 && size.width < 1024;
  const productModelScale =
    heroModelScale * (isTablet ? 0.43 : size.width < 768 ? 0.86 : 0.88);
  const introModelScale = isTablet ? productModelScale : heroModelScale;

  const JOURNEY_DROP = viewport.height * 0.12;

  const MODEL_TRANSITION_DURATION = 0.45;

  const modelEase = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const initialJourney = smoothstep(clamp01(journeyProgressRef.current));
  const initialPositionX =
    THREE.MathUtils.lerp(heroPositionX, productModelX, initialJourney) +
    (transitionRole === "incoming" ? -viewport.width * 0.72 : 0);
  const initialPositionY =
    THREE.MathUtils.lerp(heroPositionY, productModelY, initialJourney) -
    Math.sin(initialJourney * Math.PI) * JOURNEY_DROP;
  const initialScale =
    THREE.MathUtils.lerp(introModelScale, productModelScale, initialJourney) *
    modelData.fitScale;

  useFrame((_, delta) => {
    if (!active) return;
    delta = Math.min(delta, 0.05);
    const manualBlast = blastRef.current;

    manualBlastProgress.current = THREE.MathUtils.damp(
      manualBlastProgress.current,
      manualBlast ? 1 : 0,
      manualBlast ? BLAST_OPEN_SPEED : BLAST_CLOSE_SPEED,
      delta,
    );
    if (
      Math.abs(manualBlastProgress.current - (manualBlast ? 1 : 0)) < 0.0001
    ) {
      manualBlastProgress.current = manualBlast ? 1 : 0;
    }
    // Keep a manual-only clock for the DOM pieces. Scroll can keep the pump
    // open, but can never keep Header or Hero scattered after the hold ends.
    explosionProgressRef.current = smoothstep(manualBlastProgress.current);

    const scrollBlast =
      journeyProgressRef.current < 0.999
        ? clamp01(scrollExplosionRef.current)
        : 0;
    const returningBlast = clamp01(productReturnExplosionRef.current);

    // Only the original Hero GLB can ever scatter. Every other product is
    // rigid, even while the user moves through the explosion scroll ranges.
    const startupVisible = document.documentElement.dataset.startupReady !== "true";
    if (initialAssemblyEligibleRef.current && !startupVisible) {
      initialAssemblyTimeRef.current += delta;
      if (initialAssemblyTimeRef.current >= 1.9) {
        initialAssemblyEligibleRef.current = false;
      }
    }
    const initialAssembly = initialAssemblyEligibleRef.current
      ? Math.pow(1 - clamp01(initialAssemblyTimeRef.current / 1.9), 2)
      : 0;
    const morphIsReady =
      transitionRole !== "incoming" ||
      morphProgressRef.current.progress >= 0.72;
    const blastTarget =
      isGroupedPump && !isOutgoing
        ? Math.max(
            initialAssembly,
            morphIsReady
              ? manualBlast
                ? 1
                : Math.max(scrollBlast, returningBlast)
              : 0,
          )
        : 0;

    const blastSpeed =
      manualBlast && isGroupedPump
        ? BLAST_OPEN_SPEED
        : blastTarget > blastProgress.current
          ? returningToHeroRef.current
            ? RETURN_BLAST_SPEED
            : SCROLL_BLAST_SPEED
          : BLAST_CLOSE_SPEED;

    if (initialAssemblyEligibleRef.current && !manualBlast && scrollBlast === 0) {
      blastProgress.current = initialAssembly;
    } else {
      blastProgress.current = THREE.MathUtils.damp(blastProgress.current, blastTarget, blastSpeed, delta);
    }

    if (Math.abs(blastProgress.current - blastTarget) < 0.0001)
      blastProgress.current = blastTarget;
    const globalProgress = smoothstep(blastProgress.current);
    renderProgressRef.current = globalProgress;
    // Read the rendered pose, rather than waiting for the scroll journey to end.
    selectionReadyRef.current = globalProgress < 0.001 && !manualBlast;

    // Keep the authored hero flight facing the camera at any product yaw.
    // Only displacement is reoriented; assembled geometry and its own spin
    // retain their exact model-space transforms.
    if (rootRef.current) {
      scatterRootMatrix.makeRotationFromQuaternion(rootRef.current.quaternion);
      scatterViewRotation
        .setFromMatrix4(scatterRootMatrix)
        .invert()
        .multiply(scatterReferenceMatrix);
    }

    // Assembled pumps only rotate as a group; do not rewrite every part each frame.
    if (
      lastPartsPose.current.parts !== modelData.parts ||
      lastPartsPose.current.progress !== globalProgress ||
      globalProgress > 0
    ) {
      lastPartsPose.current.parts = modelData.parts;
      lastPartsPose.current.progress = globalProgress;

      modelData.parts.forEach((part) => {
        const t = clamp01((globalProgress - part.delay) / (1 - part.delay));

        if (isGroupedPump) {
          const path = part.flightPath;
          const pointCount = path ? Math.floor(path.length / 3) : 0;

          if (globalProgress === 0) {
            part.object.position.copy(part.originalPosition);
          } else if (path && pointCount >= 2) {
            // The planner may return a different number of samples than the
            // nominal step count. Always use the actual buffer length and
            // clamp the last segment, including at progress === 1.
            const pathProgress = clamp01(globalProgress) * (pointCount - 1);
            const frame = Math.min(pointCount - 2, Math.floor(pathProgress));
            const mix = pathProgress - frame;
            const currentIndex = frame * 3;
            const nextIndex = (frame + 1) * 3;

            const finiteSample =
              Number.isFinite(path[currentIndex]) &&
              Number.isFinite(path[currentIndex + 1]) &&
              Number.isFinite(path[currentIndex + 2]) &&
              Number.isFinite(path[nextIndex]) &&
              Number.isFinite(path[nextIndex + 1]) &&
              Number.isFinite(path[nextIndex + 2]);

            if (finiteSample) {
              part.object.position.fromArray(path, currentIndex);
              tempPivot.fromArray(path, nextIndex);
              part.object.position.lerp(tempPivot, mix);
            } else {
              // Never feed NaN/undefined into a Three.js transform.
              part.object.position
                .copy(part.originalPosition)
                .addScaledVector(part.explodeOffset, smootherstep(t));
            }
          } else {
            part.object.position
              .copy(part.originalPosition)
              .addScaledVector(part.explodeOffset, smootherstep(t));
          }

          tempPivot.copy(part.object.position).sub(part.originalPosition);
          scatterParentRotation
            .copy(part.inverseParentAxes)
            .multiply(scatterViewRotation)
            .multiply(part.parentAxes);
          tempPivot.applyMatrix3(scatterParentRotation);
          part.object.position.copy(part.originalPosition).add(tempPivot);

          // Rotation follows the breakaway and keeps a little momentum in the slow tail.
          const spinT = clamp01(
            (t - part.rotationLag) / (1 - part.rotationLag),
          );
          const spin =
            0.72 * smootherstep(Math.pow(spinT, 0.7)) +
            0.28 * smootherstep(spinT);
          tempQuaternion.setFromAxisAngle(
            part.rotationAxis,
            part.rotationAmount * spin,
          );

          // GLB group origins can sit far from their geometry. Rotate each piece
          // about its own center so it tumbles without orbiting the assembled pump.
          tempPivot
            .copy(part.pivotOffset)
            .applyQuaternion(tempQuaternion)
            .applyQuaternion(part.originalQuaternion);
          part.object.position.add(part.restPivotOffset).sub(tempPivot);
        } else {
          const eased = smoothstep(t);
          part.object.position
            .copy(part.originalPosition)
            .addScaledVector(part.explodeOffset, eased);
          tempQuaternion.setFromAxisAngle(
            part.rotationAxis,
            part.rotationAmount * eased,
          );
        }

        part.object.quaternion
          .copy(part.originalQuaternion)
          .multiply(tempQuaternion);
      });
    }

    const root = rootRef.current;

    if (!root) return;

    const journey = smoothstep(clamp01(journeyProgressRef.current));
    const morph = smootherstep(morphProgressRef.current.progress);
    const isIncoming = transitionRole === "incoming";
    // Cinematic 3D turntable: both pumps stay at their real size. The outgoing
    // pump turns and travels off the right edge while Hero rotates in from
    // the left, following a shallow depth arc instead of scaling away.
    const slide = isOutgoing ? morph : isIncoming ? morph - 1 : 0;
    const turn = isOutgoing
      ? -morph * Math.PI * 0.78
      : isIncoming
        ? (1 - morph) * Math.PI * 0.78
        : 0;
    const arc = isOutgoing || isIncoming ? Math.sin(morph * Math.PI) : 0;
    const targetX =
      THREE.MathUtils.lerp(heroPositionX, productModelX, journey) +
      slide * viewport.width * 0.72;

    const baseY = THREE.MathUtils.lerp(heroPositionY, productModelY, journey);

    const downSweep = Math.sin(journey * Math.PI) * JOURNEY_DROP;

    const targetY =
      baseY -
      downSweep +
      (isOutgoing ? -1 : isIncoming ? 1 : 0) * arc * viewport.height * 0.075;

    modelEntryRef.current = Math.min(
      1,
      modelEntryRef.current + delta / MODEL_TRANSITION_DURATION,
    );

    const isInProducts = journeyProgressRef.current >= 0.999;

    const entry = isInProducts ? modelEase(modelEntryRef.current) : 1;

    const entryScale = THREE.MathUtils.lerp(0.94, 1, entry);
    const targetScale =
      THREE.MathUtils.lerp(introModelScale, productModelScale, journey) *
      modelData.fitScale *
      entryScale;

    root.position.x = THREE.MathUtils.damp(root.position.x, targetX, 12, delta);

    root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 12, delta);

    root.position.z = THREE.MathUtils.damp(
      root.position.z,
      -arc * 0.3,
      12,
      delta,
    );

    const nextScale = THREE.MathUtils.damp(root.scale.x, targetScale, 8, delta);

    root.scale.setScalar(nextScale);

    // Check the actual pump meshes' cached local bounds instead of treating
    // the whole hero as a hover target. This never raycasts 300k triangles.
    let hoveringPump = false;
    if (!isOutgoing && pointerRef.current.active && globalProgress < 0.08) {
      hoverProbe.pointer.set(
        pointerRef.current.x * 2,
        -pointerRef.current.y * 2,
      );
      hoverProbe.raycaster.setFromCamera(hoverProbe.pointer, camera);
      for (const mesh of modelBaseData.hoverMeshes) {
        const bounds = mesh.geometry.boundingBox;
        if (!bounds) continue;
        hoverProbe.inverse.copy(mesh.matrixWorld).invert();
        hoverProbe.ray
          .copy(hoverProbe.raycaster.ray)
          .applyMatrix4(hoverProbe.inverse);
        if (hoverProbe.ray.intersectsBox(bounds)) {
          hoveringPump = true;
          break;
        }
      }
    }
    const pointerX = hoveringPump ? pointerRef.current.x : 0;
    const pointerY = hoveringPump ? pointerRef.current.y : 0;

    // Lenis already drives journey progress. Add rotation while it advances,
    // then let that extra momentum decay smoothly when scrolling stops.
    const scrollY = window.scrollY;
    const scrollDistance = Math.abs(
      scrollY - (previousScrollYRef.current ?? scrollY),
    );
    previousScrollYRef.current = scrollY;
    const scrollDelta = Math.min(
      scrollDistance / Math.max(window.innerHeight, 1),
      0.04,
    );
    const scrollActivity = clamp01((scrollDelta / Math.max(delta, 0.001)) * 3);
    scrollSpinRef.current = THREE.MathUtils.damp(
      scrollSpinRef.current,
      scrollActivity,
      scrollActivity > scrollSpinRef.current ? 8 : 2.5,
      delta,
    );
    const assemblyRotationMultiplier = THREE.MathUtils.lerp(
      1,
      EXPLODED_ROTATION_MULTIPLIER,
      smootherstep((globalProgress - 0.55) / 0.45),
    );
    const targetRotationSpeed =
      manualDraggingRef.current && !isOutgoing
        ? 0
        : AUTO_ROTATION_SPEED *
          assemblyRotationMultiplier *
          (1 + scrollSpinRef.current * 2.2) *
          (hoveringPump ? HOVER_ROTATION_MULTIPLIER : 1);

    currentRotationSpeedRef.current = THREE.MathUtils.damp(
      currentRotationSpeedRef.current,
      targetRotationSpeed,
      ROTATION_ACCELERATION,
      delta,
    );

    if (!manualDraggingRef.current) {
      autoRotationRef.current +=
        currentRotationSpeedRef.current * delta + scrollDelta * 0.75;
    }

    const pointerStrength =
      1 - smootherstep(globalProgress / POINTER_TILT_FADE);
    pointerYawRef.current = THREE.MathUtils.damp(
      pointerYawRef.current,
      pointerX * 0.32 * pointerStrength,
      5,
      delta,
    );
    root.rotation.y = autoRotationRef.current + pointerYawRef.current + turn;

    const baseRotationX = THREE.MathUtils.degToRad(8);

    const baseRotationZ = THREE.MathUtils.degToRad(-3);

    const desiredRotationX =
      baseRotationX +
      manualPitchRef.current +
      pointerY * -MOUSE_TILT_AMOUNT * pointerStrength;

    root.rotation.x = THREE.MathUtils.damp(
      root.rotation.x,
      desiredRotationX,
      4,
      delta,
    );

    root.rotation.z = THREE.MathUtils.damp(
      root.rotation.z,
      baseRotationZ +
        pointerX * -0.035 * pointerStrength +
        (isOutgoing ? -1 : isIncoming ? 1 : 0) * arc * 0.065,
      4,
      delta,
    );

    if (shadowRootRef.current) {
      shadowRootRef.current.position.copy(root.position);

      shadowRootRef.current.scale.copy(root.scale);
    }
  });

  return (
    <>
      <group
        ref={rootRef}
        position={[initialPositionX, initialPositionY, 0]}
        scale={initialScale}
        rotation={[
          THREE.MathUtils.degToRad(8),
          THREE.MathUtils.degToRad(-30) +
            (transitionRole === "incoming" ? Math.PI * 0.78 : 0),
          THREE.MathUtils.degToRad(-3),
        ]}
      >
        <group
          position={[
            -modelData.center.x,
            -modelData.center.y,
            -modelData.center.z,
          ]}
        >
          <primitive object={model} dispose={null} />
        </group>
      </group>

      {detachedShadow && (
        <group
          ref={shadowRootRef}
          position={[initialPositionX, initialPositionY, 0]}
          scale={initialScale}
        >
          <group
            position={[
              -modelData.center.x,
              -modelData.center.y,
              -modelData.center.z,
            ]}
          >
            <primitive object={detachedShadow} dispose={null} />
          </group>
        </group>
      )}
    </>
  );
}

export function Hero3D({
  blastRef,
  explosionProgressRef,
  pointerRef,
  scrollExplosionRef,
  productReturnExplosionRef,
  journeyProgressRef,
  returningToHeroRef,
  selectionReadyRef,
}: Hero3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [renderActive, setRenderActive] = useState(true);
  const [selectedModelUrl, setSelectedModelUrl] = useState(DEFAULT_MODEL_URL);
  const [outgoingModelUrl, setOutgoingModelUrl] = useState<string | null>(null);
  const [, startModelTransition] = useTransition();

  const selectedUrlRef = useRef(DEFAULT_MODEL_URL);
  const introPlayedRef = useRef(false);
  const morphProgressRef = useRef({ progress: 1 });
  const returnPendingRef = useRef(false);
  const morphFinishedRef = useRef(false);
  const heroModelReadyRef = useRef(false);
  const renderProgressRef = useRef(0);
  const contactQualityRef = useRef(true);

  const activeModelUrl = resolveModelUrl(selectedModelUrl);

  const isSceSelected = activeModelUrl === NEW_SCE_URL;

  const finishHeroReturn = useCallback(() => {
    if (
      !returnPendingRef.current ||
      !morphFinishedRef.current ||
      !heroModelReadyRef.current
    )
      return;
    returnPendingRef.current = false;
    setOutgoingModelUrl(null);
    // Unlock after React has removed the outgoing mesh from the scene.
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event(HERO_RETURN_COMPLETE_EVENT));
    });
  }, []);

  const handleHeroModelReady = useCallback(() => {
    heroModelReadyRef.current = true;
    finishHeroReturn();
  }, [finishHeroReturn]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let visible = true;
    const sync = () => setRenderActive(visible && !document.hidden);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const handleModelSelect = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          modelUrl?: string;
        }>
      ).detail;

      const nextModelUrl = detail?.modelUrl;

      if (!nextModelUrl) return;
      if (returningToHeroRef.current && nextModelUrl === DEFAULT_MODEL_URL) return;
      // Product's reset event must not bypass the short return transition.
      if (returnPendingRef.current && nextModelUrl === DEFAULT_MODEL_URL) return;

      if (!MODEL_URLS.includes(nextModelUrl as (typeof MODEL_URLS)[number])) {
        return;
      }

      if (nextModelUrl === selectedUrlRef.current) {
        return;
      }

      selectedUrlRef.current = nextModelUrl;
      if (hostRef.current) {
        gsap.killTweensOf(hostRef.current);
        gsap.set(hostRef.current, { clearProps: "opacity,transform" });
      }
      if (returnPendingRef.current) window.dispatchEvent(new Event(HERO_RETURN_COMPLETE_EVENT));

      // An explicit product selection cancels a return animation in flight.
      returnPendingRef.current = false;
      morphFinishedRef.current = false;
      gsap.killTweensOf(morphProgressRef.current);
      morphProgressRef.current.progress = 1;
      setOutgoingModelUrl(null);

      useGLTF.preload(resolveModelUrl(nextModelUrl));
      // Keep the current pump visible until the requested model finishes decoding.
      startModelTransition(() => setSelectedModelUrl(nextModelUrl));
    };

    window.addEventListener(PUMP_MODEL_SELECT_EVENT, handleModelSelect);

    const handleHeroReturn = () => {
      if (returnPendingRef.current) return;
      const host = hostRef.current;
      if (!host || selectedUrlRef.current === DEFAULT_MODEL_URL || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        selectedUrlRef.current = DEFAULT_MODEL_URL;
        setSelectedModelUrl(DEFAULT_MODEL_URL);
        window.dispatchEvent(new Event(HERO_RETURN_COMPLETE_EVENT));
        return;
      }
      gsap.killTweensOf(morphProgressRef.current);
      morphProgressRef.current.progress = 1;
      returnPendingRef.current = true;
      gsap.killTweensOf(host);
      // Animate the composited canvas, never hundreds of material opacities.
      // Only one pump is rendered, and the hero is already decoded/mounted.
      gsap.to(host, { x: 36, opacity: 0, duration: 0.24, ease: "power2.in", onComplete: () => {
        selectedUrlRef.current = DEFAULT_MODEL_URL;
        setOutgoingModelUrl(null);
        setSelectedModelUrl(DEFAULT_MODEL_URL);
        requestAnimationFrame(() => {
          if (!returnPendingRef.current) return;
          gsap.fromTo(host, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.38, ease: "power2.out", onComplete: () => {
            returnPendingRef.current = false;
            gsap.set(host, { clearProps: "opacity,transform" });
            window.dispatchEvent(new Event(HERO_RETURN_COMPLETE_EVENT));
          } });
        });
      } });
    };
    window.addEventListener(HERO_RETURN_EVENT, handleHeroReturn);

    return () => {
      window.removeEventListener(PUMP_MODEL_SELECT_EVENT, handleModelSelect);
      window.removeEventListener(HERO_RETURN_EVENT, handleHeroReturn);
      returnPendingRef.current = false;
      gsap.killTweensOf(morphProgressRef.current);
      if (hostRef.current) {
        gsap.killTweensOf(hostRef.current);
        gsap.set(hostRef.current, { clearProps: "opacity,transform" });
      }
      window.dispatchEvent(new Event(HERO_RETURN_COMPLETE_EVENT));
    };
  }, [startModelTransition, finishHeroReturn]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0"
      data-home-model={activeModelUrl}
    >
      <Canvas
        frameloop={renderActive ? "always" : "never"}
        camera={{
          position: [0, 0, 6.6],
          fov: 32,
          near: 0.1,
          far: 100,
        }}
        dpr={[0.75, 1.25]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          pointerEvents: "none",
          zIndex: 15,
        }}
      >
        <directionalLight position={[2.5, 4, 2]} intensity={1.4} />

        <HeroRenderBudget qualityRef={contactQualityRef} />
        <Suspense fallback={null}>
          <PumpStudioEnvironment />

          {!isSceSelected && (
            <Suspense fallback={null}>
            <ExplodableProduct
              selectionReadyRef={selectionReadyRef}
              key={activeModelUrl}
              modelUrl={activeModelUrl}
              blastRef={blastRef}
              explosionProgressRef={explosionProgressRef}
              pointerRef={pointerRef}
              scrollExplosionRef={scrollExplosionRef}
              productReturnExplosionRef={productReturnExplosionRef}
              journeyProgressRef={journeyProgressRef}
              returningToHeroRef={returningToHeroRef}
              renderProgressRef={renderProgressRef}
              introPlayedRef={introPlayedRef}
              morphProgressRef={morphProgressRef}
              transitionRole="main"
            />
            </Suspense>
          )}

          <group visible={isSceSelected}>
          <ExplodableProduct
            selectionReadyRef={selectionReadyRef}
            key={DEFAULT_MODEL_URL}
            modelUrl={DEFAULT_MODEL_URL}
            active={isSceSelected}
            blastRef={blastRef}
            explosionProgressRef={explosionProgressRef}
            pointerRef={pointerRef}
            scrollExplosionRef={scrollExplosionRef}
            productReturnExplosionRef={productReturnExplosionRef}
            journeyProgressRef={journeyProgressRef}
            returningToHeroRef={returningToHeroRef}
            renderProgressRef={renderProgressRef}
            introPlayedRef={introPlayedRef}
            morphProgressRef={morphProgressRef}
            transitionRole="main"
            onModelReady={handleHeroModelReady}
          />
          </group>

          {ENABLE_SCE_GTAO && (
            <SceContactShadows
              progressRef={renderProgressRef}
              qualityRef={contactQualityRef}
              enabled
            />
          )}
          <HeroStartupWarmup />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Decode only the opening pump during the text entrance. Other models load
// when selected instead of competing for the main thread on initial navigation.
useGLTF.preload(DEFAULT_MODEL_URL);

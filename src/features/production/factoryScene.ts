import * as THREE from "three";

// Reference colors are sRGB; THREE.Color converts them to linear shader values.
export const FACTORY_PALETTE = {
  facade: "#6C767C",
  side: "#B0B6B8",
  entrance: "#272A2D",
  bands: "#4A5359",
  fascia: "#737D82",
  portal: "#815D49",
  solarCell: "#2B3748",
  solarFrame: "#9AA4AC",
} as const;

export const FACTORY_PATTERN = {
  corrugationPitch: 0.018,
  panelWidth: 0.42,
  panelDepth: 0.4,
} as const;

type Surface = "body" | "door" | "entrance" | "bands" | "fascia" | "portal";
const normalizedName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");

function belongsTo(object: THREE.Object3D, name: string): boolean {
  for (
    let current: THREE.Object3D | null = object;
    current;
    current = current.parent
  ) {
    if (
      normalizedName(current.userData.name ?? current.name) ===
      normalizedName(name)
    )
      return true;
  }
  return false;
}

function referenceMaterial(
  source: THREE.MeshStandardMaterial,
  surface: Surface,
) {
  const material = source.clone();
  material.roughness = surface === "entrance" ? 0.48 : 0.6;
  material.metalness = surface === "entrance" ? 0.12 : 0.22;
  material.envMapIntensity = 0.3;
  material.onBeforeCompile = (shader) => {
    for (const [name, color] of Object.entries(FACTORY_PALETTE)) {
      shader.uniforms[`factory_${name}`] = { value: new THREE.Color(color) };
    }
    const varyings =
      "varying vec3 vFactoryPosition; varying vec3 vFactoryNormal;\n";
    shader.vertexShader =
      varyings +
      shader.vertexShader.replace(
        "#include <project_vertex>",
        `#include <project_vertex>
       vFactoryPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
       vFactoryNormal = transformNormalByInverseViewMatrix(transformedNormal, viewMatrix);`,
      );
    shader.fragmentShader =
      varyings +
      Object.keys(FACTORY_PALETTE)
        .map((name) => `uniform vec3 factory_${name};`)
        .join("\n") +
      "\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
       vec3 factoryP = vFactoryPosition;
       vec3 factoryN = normalize(vFactoryNormal);
       bool factoryRoof = ${surface === "body" ? "true" : "false"}
         && factoryN.y > 0.7 && factoryP.y > 0.625 && factoryP.y < 0.85;
       bool factoryEntrance = (factoryN.z > 0.7 && factoryP.z > 3.36 && factoryP.x > 1.485)
         || (factoryN.x > 0.7 && factoryP.x > 3.38 && factoryP.z > 2.44);
       bool factoryCorrugated = ${
         surface === "door"
           ? "true"
           : surface === "body"
             ? "!factoryRoof && !factoryEntrance && abs(factoryN.y) < 0.65 && factoryP.y > 0.02 && factoryP.y < 0.65"
             : "false"
       };
       float factoryRows = factoryP.y / ${FACTORY_PATTERN.corrugationPitch};
       float factoryPhase = fract(factoryRows);
       float factoryAA = max(fwidth(factoryRows), 0.025);
       float factorySeam = 1.0 - smoothstep(0.015, 0.015 + factoryAA,
         min(factoryPhase, 1.0 - factoryPhase));
       if (factoryRoof) {
         vec2 panel = (factoryP.xz + vec2(3.5)) / vec2(${FACTORY_PATTERN.panelWidth}, ${FACTORY_PATTERN.panelDepth});
         vec2 tile = fract(panel);
         vec2 edge = min(tile, 1.0 - tile);
         vec2 aa = max(fwidth(panel), vec2(0.001));
         vec2 frameLines = 1.0 - smoothstep(vec2(0.018) - aa * 0.5,
           vec2(0.018) + aa * 0.5, edge);
         frameLines = mix(frameLines, vec2(0.036), smoothstep(vec2(0.2), vec2(1.0), aa));
         float frame = 1.0 - (1.0 - frameLines.x) * (1.0 - frameLines.y);
         vec2 cell = fract(tile * vec2(3.0, 6.0));
         vec2 cellEdge = min(cell, 1.0 - cell);
         float cellLine = 1.0 - min(smoothstep(0.005, 0.005 + aa.x * 3.0, cellEdge.x),
           smoothstep(0.005, 0.005 + aa.y * 6.0, cellEdge.y));
         vec3 panelColor = factory_solarCell * (0.96 + 0.05 * mod(floor(panel.x) + floor(panel.y), 2.0));
         panelColor = mix(panelColor, factory_solarFrame, cellLine * 0.012);
         diffuseColor.rgb = mix(panelColor, factory_solarFrame, frame);
       } else if (factoryCorrugated) {
         vec3 siding = abs(factoryN.x) > 0.7 ? factory_side : factory_facade;
         diffuseColor.rgb = siding * (0.98 + 0.14 * cos(factoryPhase * 6.2831853) - 0.28 * factorySeam);
       } ${
         surface === "body"
           ? `else if (factoryEntrance && factoryP.y < 0.65) {
         diffuseColor.rgb = factory_entrance;
       }`
           : surface === "entrance"
             ? `else {
         diffuseColor.rgb = factory_entrance * mix(0.94, 1.04, smoothstep(0.0, 0.65, factoryP.y));
       }`
             : surface === "bands" ||
                 surface === "fascia" ||
                 surface === "portal"
               ? `else {
         diffuseColor.rgb = factory_${surface};
       }`
               : ""
       }`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
       if (factoryRoof) roughnessFactor = 0.48;
       if (factoryCorrugated) roughnessFactor = 0.62;`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
       if (factoryCorrugated) {
         float fade = 1.0 - smoothstep(0.3, 1.0, fwidth(factoryRows));
         vec3 ridgeNormal = normalize(factoryN + vec3(0.0, 0.3 * sin(factoryPhase * 6.2831853) * fade, 0.0));
         normal = normalize(mat3(viewMatrix) * ridgeNormal) * faceDirection;
       }`,
      );
  };
  material.customProgramCacheKey = () => `factory-reference-v2-${surface}`;
  return material;
}

/** Match the Figma reference on clones while retaining all embedded texture maps. */
export function prepareFactoryScene(source: THREE.Object3D) {
  const scene = source.clone(true);
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const cache = new Map<THREE.Material, Map<Surface, THREE.Material>>();
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const body = belongsTo(object, "Cube");
    const door = ["Cube.023", "Cube.024", "Cube.025"].some((name) =>
      belongsTo(object, name),
    );
    const modify = (original: THREE.Material): THREE.Material => {
      if (
        !(original instanceof THREE.MeshStandardMaterial) ||
        original.map ||
        original.normalMap
      )
        return original;
      let surface: Surface | null = null;
      if (body && original.name === "Material.002") surface = "body";
      else if (door && original.name === "Material.002") surface = "door";
      else if (body && original.name === "Window Grid Glass - Adjustable Ratio")
        surface = "entrance";
      else if (body && original.name === "Material") surface = "bands";
      else if (
        belongsTo(object, "Cube.004") &&
        original.name === "Material.003"
      )
        surface = "fascia";
      else if (original.name === "Material.001") surface = "portal";
      if (!surface) return original;
      let bySurface = cache.get(original);
      if (!bySurface) cache.set(original, (bySurface = new Map()));
      let material = bySurface.get(surface);
      if (!material) {
        material = referenceMaterial(original, surface);
        bySurface.set(surface, material);
        materials.push(material);
      }
      return material;
    };
    object.material = Array.isArray(object.material)
      ? object.material.map(modify)
      : modify(object.material);
  });
  const louver = new THREE.Group();
  louver.name = "Factory entry louver";
  louver.position.set(2.997, 0.54, 3.6);
  const backingGeometry = new THREE.PlaneGeometry(0.354, 0.56);
  const slatGeometry = new THREE.BoxGeometry(0.354, 0.006, 0.008);
  const backingMaterial = new THREE.MeshStandardMaterial({
    color: "#333B40",
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 0.3,
  });
  const slatMaterial = new THREE.MeshStandardMaterial({
    color: "#80888C",
    roughness: 0.65,
    metalness: 0.2,
    envMapIntensity: 0.3,
  });
  const slats = new THREE.InstancedMesh(slatGeometry, slatMaterial, 43);
  const matrix = new THREE.Matrix4();
  for (let index = 0; index < slats.count; index++) {
    matrix.makeTranslation(
      0,
      -0.277 + (index / (slats.count - 1)) * 0.554,
      0.006,
    );
    slats.setMatrixAt(index, matrix);
  }
  slats.instanceMatrix.needsUpdate = true;
  // Release the instance buffer together with its owned geometry.
  slatGeometry.addEventListener("dispose", () => slats.dispose());
  louver.add(new THREE.Mesh(backingGeometry, backingMaterial), slats);
  scene.add(louver);
  materials.push(backingMaterial, slatMaterial);
  geometries.push(backingGeometry, slatGeometry);
  return { scene, materials, geometries };
}

import * as THREE from "three";

/** Share the hero's surface finish, never its geometry-specific baked AO. */
export function createPumpMaterialAdapter(hero: THREE.Object3D) {
  const library = new Map<string, THREE.MeshStandardMaterial>();
  hero.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (material instanceof THREE.MeshStandardMaterial) library.set(material.name, material);
    }
  });
  const ownedTextures = new Set<THREE.Texture>();
  const textures = new Map<string, THREE.Texture>();
  const tile = (source: THREE.Texture | null, repeat: number) => {
    if (!source) return null;
    const key = `${source.uuid}:${repeat}`;
    const cached = textures.get(key);
    if (cached) return cached;
    const texture = source.clone();
    texture.channel = 0;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.offset.set(0, 0);
    texture.rotation = 0;
    texture.updateMatrix();
    texture.needsUpdate = true;
    textures.set(key, texture);
    ownedTextures.add(texture);
    return texture;
  };
  const adapt = (source: THREE.Material) => {
    if (!(source instanceof THREE.MeshStandardMaterial)) return source.clone();
    const name = source.name.toLocaleLowerCase("tr-TR");
    const color = source.color;
    const blue = color.b > color.r * 1.4 && color.b > color.g * 1.15;
    const paint = blue || /mavi|gövde|gö vde|metal rough|siyah metal/.test(name);
    const plastic = !paint && /plastic|plastik|rubber|kauçuk/.test(name);
    const copper = !paint && (/copper|bakır|bronze/.test(name) || (color.r > color.g * 1.6 && color.g > color.b * 1.6));
    const template = library.get(paint ? "Metal rough" : plastic ? "Grained black plastic" : copper ? "Sandblasted copper" : "Brushed stainless steel");
    const material = template?.clone() ?? new THREE.MeshPhysicalMaterial();
    material.name = source.name;
    material.side = source.side;
    material.transparent = false;
    material.opacity = 1;
    material.depthWrite = material.depthTest = true;
    material.alphaTest = 0;
    material.aoMap = null;
    material.lightMap = null;
    material.emissiveMap = null;
    material.emissive.set(0);
    material.envMap = null;
    // Use the target UV layout with a restrained, consistent surface grain.
    const originalRepeat = source.normalMap?.repeat.x ?? source.map?.repeat.x ?? 4;
    const repeat = THREE.MathUtils.clamp(originalRepeat, 2, 12);
    material.map = tile(template?.map ?? null, repeat);
    material.normalMap = tile(template?.normalMap ?? null, repeat);
    material.roughnessMap = tile(template?.roughnessMap ?? null, repeat);
    material.metalnessMap = tile(template?.metalnessMap ?? null, repeat);
    if (paint && !blue) {
      // Keep charcoal motor housings and colored guards distinct from blue castings.
      material.map = null;
      material.color.copy(color);
    } else if (!paint && !plastic && !copper) {
      const brightness = Math.max(color.r, color.g, color.b);
      if (brightness < 0.08) {
        material.color.setRGB(0.025, 0.027, 0.03);
        material.roughness = 0.55;
      } else if (Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b) > 0.25) {
        material.color.copy(color);
        material.metalness = 0.25;
      }
    }
    material.needsUpdate = true;
    return material;
  };
  return { adapt, dispose: () => ownedTextures.forEach(texture => texture.dispose()) };
}

import * as THREE from "three";

export const SCATTER_STEPS = 96;

export type ScatterFlight = {
  origin: THREE.Vector3;
  destination: THREE.Vector3;
  release: THREE.Vector3;
  arc: THREE.Vector3;
  radius: number;
  halfSize: THREE.Vector3;
  basis: THREE.Matrix3;
  rotationAxis: THREE.Vector3;
  rotationAmount: number;
  rotationLag: number;
  frameWidth: number;
  frameHeight: number;
  frameDepth: number;
  delay: number;
  launchPower: number;
  toParent: THREE.Matrix4;
  restPivot: THREE.Vector3;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Calculates one settled, collision-aware exploded layout and then bakes
 * smooth, independent flights towards it. Collision corrections must NEVER
 * run separately on each animation frame: doing so makes pieces change lanes,
 * recoil and bounce as their animated bounding boxes begin to overlap.
 */
export function buildScatterPaths(flights: ScatterFlight[], diagonal: number) {
  const count = flights.length;
  const safeDiagonal = Math.max(Math.abs(diagonal), 0.0001);
  const gap = safeDiagonal * 0.028;

  const paths = flights.map(() => new Float32Array((SCATTER_STEPS + 1) * 3));
  const bounds = new THREE.Box3();

  if (count === 0) return { paths, bounds };

  const targets = new Float64Array(count * 3);
  const extents = new Float64Array(count * 3);
  const mobility = flights.map(
    (part) => 1 / (0.04 + part.radius * part.radius),
  );

  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Matrix4();
  const axes = new THREE.Matrix3();
  const localAxes = new THREE.Matrix3();
  const point = new THREE.Vector3();

  // Work out clearance at the final rotation, once. The animated model may be
  // nested at rest, so enforcing full-size clearance on early flight frames
  // produces an artificial jolt immediately after the release.
  for (let i = 0; i < count; i++) {
    const part = flights[i];
    const index = i * 3;
    part.destination.toArray(targets, index);
    // Only a subtle widening; preserve the carefully arranged exploded view.
    targets[index] *= 1.02;
    targets[index + 1] *= 1.02;

    quaternion.setFromAxisAngle(part.rotationAxis, part.rotationAmount);
    localAxes.setFromMatrix4(rotation.makeRotationFromQuaternion(quaternion));
    axes.copy(part.basis).multiply(localAxes);

    const matrix = axes.elements;
    const half = part.halfSize;
    extents[index] =
      Math.abs(matrix[0]) * half.x +
      Math.abs(matrix[3]) * half.y +
      Math.abs(matrix[6]) * half.z;
    extents[index + 1] =
      Math.abs(matrix[1]) * half.x +
      Math.abs(matrix[4]) * half.y +
      Math.abs(matrix[7]) * half.z;
    extents[index + 2] =
      Math.abs(matrix[2]) * half.x +
      Math.abs(matrix[5]) * half.y +
      Math.abs(matrix[8]) * half.z;
  }

  // Settle the DESTINATIONS only. A capped, damped adjustment prevents large
  // or nested castings from pushing the whole exploded view off the screen.
  for (let pass = 0; pass < 32; pass++) {
    let biggestCorrection = 0;

    for (let i = 1; i < count; i++) {
      for (let j = 0; j < i; j++) {
        const a = i * 3;
        const b = j * 3;
        const deltaX = targets[a] - targets[b];
        const deltaY = targets[a + 1] - targets[b + 1];
        const deltaZ = targets[a + 2] - targets[b + 2];

        const overlapX = extents[a] + extents[b] + gap - Math.abs(deltaX);
        if (overlapX <= 0) continue;

        const overlapY =
          extents[a + 1] + extents[b + 1] + gap - Math.abs(deltaY);
        if (overlapY <= 0) continue;

        const overlapZ =
          extents[a + 2] + extents[b + 2] + gap - Math.abs(deltaZ);
        if (overlapZ <= 0) continue;

        // Prefer visible horizontal/vertical clearance over using excessive
        // depth, but allow depth when it requires substantially less travel.
        const axis =
          overlapX <= overlapY * 1.08 && overlapX <= overlapZ * 1.65
            ? 0
            : overlapY * 1.08 <= overlapZ * 1.65
              ? 1
              : 2;
        const overlap =
          axis === 0 ? overlapX : axis === 1 ? overlapY : overlapZ;

        const originalDifference =
          flights[i].destination.getComponent(axis) -
          flights[j].destination.getComponent(axis);
        const currentDifference = targets[a + axis] - targets[b + axis];
        const originDifference =
          flights[i].origin.getComponent(axis) -
          flights[j].origin.getComponent(axis);
        const direction =
          Math.abs(originalDifference) > 0.00001
            ? Math.sign(originalDifference)
            : Math.abs(originDifference) > 0.00001
              ? Math.sign(originDifference)
              : Math.abs(currentDifference) > 0.00001
                ? Math.sign(currentDifference)
                : 1;

        const correction =
          Math.min(overlap + gap * 0.1, safeDiagonal * 0.09) * 0.65;
        const share = mobility[i] / (mobility[i] + mobility[j]);

        targets[a + axis] += direction * correction * share;
        targets[b + axis] -= direction * correction * (1 - share);
        biggestCorrection = Math.max(biggestCorrection, correction);
      }
    }

    for (let i = 0; i < count; i++) {
      const part = flights[i];
      const index = i * 3;
      const limitX = Math.max(
        part.frameWidth * 0.18,
        part.frameWidth - extents[index],
      );
      const limitY = Math.max(
        part.frameHeight * 0.18,
        part.frameHeight - extents[index + 1],
      );
      const limitZ = Math.max(
        part.frameDepth * 0.2,
        part.frameDepth - extents[index + 2],
      );

      targets[index] = THREE.MathUtils.clamp(targets[index], -limitX, limitX);
      targets[index + 1] = THREE.MathUtils.clamp(
        targets[index + 1],
        -limitY,
        limitY,
      );
      targets[index + 2] = THREE.MathUtils.clamp(
        targets[index + 2],
        -limitZ,
        limitZ,
      );
    }

    if (biggestCorrection < safeDiagonal * 0.0001) break;
  }

  // Keep the decorative breakaway and arc small compared with each part's
  // actual travel. Both envelopes end at zero with zero ending velocity.
  const releases: THREE.Vector3[] = [];
  const arcs: THREE.Vector3[] = [];
  const displacement = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const part = flights[i];
    displacement.fromArray(targets, i * 3).sub(part.origin);
    const distance = displacement.length();
    const release = part.release.clone();
    const arc = part.arc.clone();

    if (distance > 0.000001) {
      const forward = displacement.multiplyScalar(1 / distance);
      // Ignore release components pointing back towards the assembled model.
      const backward = release.dot(forward);
      if (backward < 0) release.addScaledVector(forward, -backward);
    }

    release.clampLength(0, Math.min(safeDiagonal * 0.1, distance * 0.22));
    arc.clampLength(0, Math.min(safeDiagonal * 0.12, distance * 0.22));
    releases.push(release);
    arcs.push(arc);
  }

  // Every frame is a sample of ONE analytic, continuous path. There are no
  // frame-dependent collision corrections, so the flight cannot 'change its
  // mind' or receive another impulse after the explosion is finished.
  for (let sample = 0; sample <= SCATTER_STEPS; sample++) {
    const progress = sample / SCATTER_STEPS;

    for (let i = 0; i < count; i++) {
      const part = flights[i];
      const index = i * 3;
      const t = clamp01(
        (progress - part.delay) / Math.max(0.001, 1 - part.delay),
      );

      const travel = ease(
        Math.pow(t, THREE.MathUtils.clamp(part.launchPower, 0.55, 1.1)),
      );
      const releaseWeight = 6 * t * (1 - t) * (1 - t);
      const arcWeight = 16 * t * t * (1 - t) * (1 - t);

      point.set(
        part.origin.x +
          (targets[index] - part.origin.x) * travel +
          releases[i].x * releaseWeight +
          arcs[i].x * arcWeight,
        part.origin.y +
          (targets[index + 1] - part.origin.y) * travel +
          releases[i].y * releaseWeight +
          arcs[i].y * arcWeight,
        part.origin.z +
          (targets[index + 2] - part.origin.z) * travel +
          releases[i].z * releaseWeight +
          arcs[i].z * arcWeight,
      );

      bounds.expandByPoint(point);
      point
        .applyMatrix4(part.toParent)
        .sub(part.restPivot)
        .toArray(paths[i], sample * 3);
    }
  }

  return { paths, bounds };
}

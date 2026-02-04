import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import {
  dbs,
  zs,
  countBoxes,
  mnbs,
  mxbs,
  dclr,
  randRatio,
  totalWidth,
  totalHeight,
  pallete,
  hairPallete,
  facePallete,
  sunsetPallete,
  sunsetPallete2
}
from "./consts.js"

const {sin, cos, PI, random, pow} = Math;

const randInRange = (xmin, xmax, randVal) => (
    (xmax - xmin) * randVal + xmin
  )

const pSin = (x) => (sin(x) + 1) / 2
const pCos = (x) => (cos(x) + 1) / 2

const distance3D = (a,b) => {
  return sqrt(a.x*b.x + a.y*b.y + a.z*b.x)
}

const loadTextureF = async (url) => {
  return new Promise((resolve, reject) => {
    let texture;
    let onLoadF = function () {
      resolve(texture);
      
    };
    let onProgressF = function () { };
    let onErrorF = function (url) {
      resolve(false);
      
    };
    let managerv = new THREE.LoadingManager(onLoadF, onProgressF, onErrorF);
    let loaderv = new THREE.TextureLoader(managerv);
    texture = loaderv.load(url);
   });
}

function getRectangleCorners(posA, posB, width) {
  const halfWidth = width / 2;

  // 1. Get the direction vector from A to B
  const dir = new THREE.Vector3().subVectors(posB, posA);

  // 2. Get the perpendicular direction in the XY plane
  // We normalize it so we can scale it by halfWidth
  const perpDir = new THREE.Vector3(-dir.y, dir.x, 0).normalize();

  // 3. Calculate the 4 corners
  const corners = [
      // Corners near Point A
      new THREE.Vector3().copy(posA).addScaledVector(perpDir, halfWidth),  // Corner 1
      new THREE.Vector3().copy(posA).addScaledVector(perpDir, -halfWidth), // Corner 2

      // Corners near Point B
      new THREE.Vector3().copy(posB).addScaledVector(perpDir, -halfWidth), // Corner 3
      new THREE.Vector3().copy(posB).addScaledVector(perpDir, halfWidth)   // Corner 4
  ];

  return corners;
}

function snapTo90Degrees(angle) {
  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  // ((a % n) + n) % n to handle negative angles correctly
  let normalized = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
  let snappedSlot = Math.round(normalized / HALF_PI);

  let result = snappedSlot * HALF_PI;

  return result % TWO_PI;
}

function fractionValue(value, step) {
  const result = Math.floor(value / step) * step;
  return result;
}

function isPointInPolygon(point, polygon) {
  const x = point.x;
  const y = point.y;
  let inside = false;

  // Loop through each edge of the polygon
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      // Check if the ray from the point intersects with the edge (i, j)
      const intersect = ((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
  }

  return inside;
}

function psin(x) {
  return (sin(x) + 1) / 2
}

function getPerpendicularPoint(posA, posB, distance = 1) {
  // 1. Get the direction from A to B
  const dir = new THREE.Vector3().subVectors(posB, posA);

  // 2. We only care about X and Y for the rotation
  const dx = dir.x;
  const dy = dir.y;

  // 3. Calculate the perpendicular vector (-dy, dx)
  // This rotates the direction 90 degrees counter-clockwise in the XY plane
  const perpDir = new THREE.Vector3(-dy, dx, 0);

  // 4. Normalize (make it length 1) and scale by distance
  perpDir.normalize().multiplyScalar(distance);

  // 5. Add to the original bone position to get the final point
  return new THREE.Vector3().copy(posA).add(perpDir);
}

function lerpAlongPath(points, t) {
  if (points.length === 0) return new THREE.Vector3();
  if (points.length === 1) return points[0].clone();

  // 1. Clamp t to ensure it stays within bounds
  t = Math.max(0, Math.min(1, t));

  // 2. Calculate which segment we are in
  // If there are 4 points, there are 3 segments (0-1, 1-2, 2-3)
  const segmentCount = points.length - 1;
  const progress = t * segmentCount; 
  const index = Math.floor(progress); // The starting dot of the segment

  // 3. Handle the very end of the path (t = 1)
  if (index >= segmentCount) {
      return points[points.length - 1].clone();
  }

  // 4. Calculate local t for this specific segment (0 to 1)
  const localT = progress - index;

  // 5. Lerp between the start and end of that segment
  const startNode = points[index];
  const endNode = points[index + 1];

  return new THREE.Vector3().lerpVectors(startNode, endNode, localT);
}

function getAngle360(v1, v2, normal) {
  let angle = v1.angleTo(v2);

  // 2. Use cross product to check direction relative to the normal
  const cross = new THREE.Vector3().crossVectors(v1, v2);
  
  // 3. If the cross product points opposite to our normal, it's > 180 degrees
  if (normal.dot(cross) < 0) {
      angle = Math.PI * 2 - angle;
  }

  return angle
}

function getAngleXYfrom3D(v1, v2) {
  const v12d = new THREE.Vector2(v1.x, v1.y);
  const v22d = new THREE.Vector2(v2.x, v2.y);
  return getAngle2DRadians(v12d, v22d);
}

function getAngle2DRadians(v1, v2) {
  // .angle() returns Math.atan2(y, x) in the range (-PI, PI]
  let angle = v1.angle() - v2.angle();

  // Normalize the result to the [0, 2 * PI) range
  if (angle > Math.PI) angle -= Math.PI * 2;
  if (angle <= -Math.PI) angle += Math.PI * 2;

  return angle;
}

function getRandomPointBetweenPoints(pointArray) {
  const weights = pointArray.map(() => random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const result = new THREE.Vector3(0, 0, 0);

  pointArray.forEach((point, i) => {
      const normalizedWeight = weights[i] / totalWeight;
      result.addScaledVector(point, normalizedWeight);
  });

  return result;
}

function getPointBetweenPoints(pointArray, lerpFactor = 0) {
  const n = pointArray.length;
  if (n === 0) return new THREE.Vector3();
  if (n === 1) return pointArray[0].clone();

  // 1. Clamp factor between 0 and 1 to prevent overshooting
  const t = THREE.MathUtils.clamp(lerpFactor, 0, 1);

  const result = new THREE.Vector3(0, 0, 0);
  const weights = [];
  let totalWeight = 0;

  // 2. Calculate a "Gaussian-style" weight for each point
  // Each point 'i' has a target peak at (i / (n-1))
  for (let i = 0; i < n; i++) {
      const peak = i / (n - 1);
      // The 'influence' decreases as the distance from the peak increases
      // Using a power function (like 1 / (1 + dist*dist)) creates a smooth blend
      const distance = Math.abs(t - peak);
      const weight = Math.pow(1 - distance, 8); // Higher power = sharper focus on points
      
      weights.push(weight);
      totalWeight += weight;
  }

  // 3. Sum the weighted points
  pointArray.forEach((point, i) => {
      const normalizedWeight = weights[i] / totalWeight;
      result.addScaledVector(point, normalizedWeight);
  });

  return result;
}

function drawLine(scene, points, options) {
  const lineWidth = options?.lineWidth || 1;
  const color = options?.color || 0xffffff;
  const dashSize = options?.dashSize || 0;
  const gapSize = options?.gapSize || 0;

  const flatPath = points.flatMap(v => [v.x, v.y, v.z]);
  // console.log("flatPath", flatPath)
  const geometry = new LineGeometry();
  if (flatPath.length < 2) return
  geometry.setPositions(flatPath);
  const material = 
  new LineMaterial({
    color,
    linewidth: lineWidth,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    dashed: dashSize > 0 && gapSize > 0,
    dashSize,
    gapSize,
  });
  material.resolution.set(totalWidth, totalHeight);
  material.needsUpdate = true;

  const line = new Line2(geometry, material);
  scene.add(line);
}


export {
  randInRange,
  pSin,
  pCos,
  distance3D,
  loadTextureF,
  getRectangleCorners,
  snapTo90Degrees,
  fractionValue,
  isPointInPolygon,
  psin,
  getAngleXYfrom3D,
  getAngle360,
  getAngle2DRadians,
  lerpAlongPath,
  getRandomPointBetweenPoints,
  getPerpendicularPoint,
  getPointBetweenPoints,
  drawLine
}
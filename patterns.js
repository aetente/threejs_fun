import * as THREE from 'three';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import { Vector3 } from 'three';
import {
  isPointInPolygon,
  psin,
  lerpAlongPath,
  getRandomPointBetweenPoints,
  drawLine
} from './utils.js';

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
  sunsetPallete2,
  testPalette1
}
from "./consts.js"

const { sin, cos, PI, random, pow, floor, abs } = Math;

function pattern1(scene, pointsArray, options) {
  let limit = options?.limit || 50;
  let maxLines = options?.maxLines || 30
  const scale = options?.scale || 1;
  const offset = options?.offset || new THREE.Vector3(0, 0, 0.1);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const initAngle = (options?.initAngle || random() * PI * 2)
  let scaleSize = 0.05 * scale
  let points = [];
  let angleVal = 0;
  let previousAngle = initAngle;
  
  const lineWidth = 3;
  
  for (let i = 0; i < limit; i++) {
    let nextPos = getRandomPointBetweenPoints(pointsArray);
    let previousPos = getRandomPointBetweenPoints(pointsArray);
    const idByPos = previousPos.x + previousPos.y + previousPos.z
    for (let j = 0; j < maxLines; j++) {
      // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
      const angleCap = PI/4
      const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      //const angleChange = sin( sin(20*i*j + idByPos) * PI) * angleCap
      //const angleChange = sin(i + idByPos) * angleCap
      //const angleChange = 0
      angleVal = previousAngle + angleChange
      scaleSize = abs(angleVal / PI / 3) * 0.01 * scale;
      previousAngle = angleVal;
      const currentPos = new THREE.Vector3(
        sin(angleVal) * scaleSize,
        cos(angleVal) * scaleSize,
        0
      );
      nextPos = previousPos.clone().add(currentPos);
        
      const sunsetPalleteIndex = psin(angleVal / angleCap * PI * 2) * (testPalette1.length - 1);
      const color = testPalette1[Math.floor(sunsetPalleteIndex)];
      const previousPosWithOffset = previousPos.clone().add(offset);
      const nextPosWithOffset = nextPos.clone().add(offset);
      drawLine(scene, [previousPosWithOffset, nextPosWithOffset], { lineWidth: i == 0 ? 5 : lineWidth, color: i === 0 ? 0xffffff : color });
      
      previousPos.copy(nextPos);
      points.push(nextPos.clone());
    }
    points = []
    const circle = new THREE.CircleGeometry(0.002 * random() + 0.02, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const shape = new THREE.Mesh(circle, material);
      shape.position.set(nextPos.x, nextPos.y, nextPos.z + 0.2);
    //scene.add(shape);
  }
}

export {
  pattern1
}
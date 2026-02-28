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

const { sin, cos, PI, random, pow, floor, abs, sqrt, max, min } = Math;
const p2 = PI*2

function norm(x, base, spread) {
  return base^(-(x*x)/spread)
}

function pattern1(scene, pointsArray, options) {
  let limit = options?.limit || 20;
  let maxLines = options?.maxLines || 200
  const scale = options?.scale || 2;
  const offset = options?.offset || new THREE.Vector3(0, 0, 0.1);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const refPoint = options?.refPoint || new Vector3(0,0,0)
  const initAngle = options?.initAngle || 0
  let desiredAngle = options?.desiredAngle || 0;
  let scaleSize = 0.05 * scale
  let points = [];
  let angleVal = 0;
  let previousAngle = initAngle;
  const angleToRef = options?.angleToRef || false
  
  const lineWidth = 3;
  
  for (let i = 0; i < limit; i++) {
    const iScale = i/limit
    let nextPos = getRandomPointBetweenPoints(pointsArray);
    let previousPos = getRandomPointBetweenPoints(pointsArray);
    const idByPos = previousPos.x + previousPos.y + previousPos.z
    previousAngle = initAngle
    for (let j = 0; j < maxLines; j++) {
      // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
      const indexId = sin((i+j)/10)
      const jScale = sin(j/maxLines * p2  + indexId)
      const distToRef = previousPos.distanceTo(refPoint)+1
      const angleCap = PI/3.5
      //const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      
      const angleChange = jScale* sin(
        sin(2*sin(indexId*PI)/distToRef + idByPos)
        * PI
      ) * angleCap
      //const angleChange = sin(i + idByPos) * angleCap
      //const angleChange = 0
      
      //const correctAngle = angleChange + ((desiredAngle - angleChange)%p2)/1
      let distFactor = min(1,1/(2*distToRef-1))
      angleVal = previousAngle + angleChange
      if (angleToRef) {
        desiredAngle = previousPos.angleTo(refPoint)
      }
      angleVal = angleVal + (desiredAngle - angleVal)/2 * (distFactor)
      scaleSize = psin(angleVal / PI / 3) * 0.1 * scale /1.4;
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
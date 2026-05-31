import * as THREE from 'three';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import { Vector3, MathUtils } from 'three';
import {
  isPointInPolygon,
  psin,
  lerpAlongPath,
  getRandomPointBetweenPoints,
  drawLine,
  randInRange,
  signedAngle
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
  testPalette1,
  flowersPalette1,
  testPalette2,
  flowersPalette2
}
from "./consts.js"

const { sin, cos, PI, random, pow, floor, abs, sqrt, max, min, sign, round } = Math;
const {seededRandom} = MathUtils
const p2 = PI*2

function norm(x, base, spread) {
  return base^(-(x*x)/spread)
}

const randomSeed = 56764448754;
const randomSeed2 = 5674433568754;

function pattern1(scene, pointsArray, options) {
  let limit = options?.limit || 170;
  let maxLines = options?.maxLines || 110
  const scale = options?.scale || 2;
  const offset = options?.offset || new THREE.Vector3(0, 0, 0.1);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const refPoint = options?.refPoint || new Vector3(0,0,0)
  const refPointV2 = new THREE.Vector2(refPoint?.x || 0, refPoint?.y || 0)
  const initAngle = options?.initAngle || 0
  let desiredAngle = options?.desiredAngle || 0;
  let previousDesiredAngle = desiredAngle
  let scaleSize = 0.05 * scale
  let points = [];
  let angleVal = 0;
  let previousAngle = initAngle;
  const angleToRef = options?.angleToRef || false
  
  const lineWidth = options?.lineWidth || 2;
  
  const avoidPoints = options?.avoidPoints || null

  const lineColor = options?.lineColor || null
  const dotColor = options?.dotColor || null

  const dotScale = (options?.dotScale || 1)
  const t = options?.t || 0
  
  
  
  for (let i = 0; i < limit; i++) {
    
    const insidePoints = []
    const iScale = i/limit
    let nextPos = getRandomPointBetweenPoints(pointsArray);
    let previousPos = getRandomPointBetweenPoints(pointsArray);
    const initPos = previousPos.clone()
    const idByPos = previousPos.x + previousPos.y + previousPos.z
    previousAngle = initAngle
    const randomDir = seededRandom(randomSeed) > 0.5 ? 1 : -1
    for (let j = 0; j < maxLines; j++) {
      // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
      const previousPosV2 = new THREE.Vector2(previousPos.x, previousPos.y)
      const indexId = sin((i+j)/10)
      const jScale = sin(j/maxLines * p2  + indexId)
      const distToRef = previousPos.distanceTo(refPoint)+1
      const angleCap = PI*2
      //const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      
      // const angleChange = jScale* sin(
      //   sin(0.5*sin(indexId*PI) + idByPos / 100)
      //   * PI
      // ) * angleCap
      
      const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      //const angleChange = sin(i + idByPos) * angleCap
      //const angleChange = 0
      
      //const correctAngle = angleChange + ((desiredAngle - angleChange)%p2)/1
      //let distFactor = min(1,1/(2*distToRef-1))
      //let distFactor = 1
      let distFactor = max(1*min(1, distToRef - 1),0)
      angleVal = previousAngle + angleChange
      if (angleToRef) {
        
        desiredAngle = signedAngle( previousPosV2, refPointV2)
        // Angle of point B relative to point A
        const dx = refPoint.x - previousPos.x;
        const dy = refPoint.y - previousPos.y;

        let angleRadians = Math.atan2(dy, -dx);
        // if (angleRadians < 0) {
        //   angleRadians += 4 * Math.PI;
        // } 
        desiredAngle =
          // angleRadians
          // angleRadians - PI/2
          (angleRadians + 3*PI/2) % (2*PI)
          // previousPosV2.angleTo(refPointV2)
          // if (desiredAngle < 0) {
          //   desiredAngle += 2 * PI;
          // }

        // quick fix for angle jumping
        if (j > 0) {
          if (desiredAngle - previousDesiredAngle > PI) {
            desiredAngle -= 2*PI
          } else if (desiredAngle - previousDesiredAngle < -PI) {
            desiredAngle += 2*PI
          }
        }

        previousDesiredAngle = desiredAngle
        // console.log(previousPosV2, refPointV2, desiredAngle)

        //j % 50 == 0 && 
        //console.log(desiredAngle, previousPosV2)
      }
      const avoidAngles = []
      angleVal = 
        //desiredAngle
        angleVal
        + (desiredAngle - angleVal%(2*PI))/2
        //*2
        * (distFactor)
      if (avoidPoints) {
        avoidPoints.forEach((ap, ip) => {
          const maxReflect = PI
          const distToAvoidPoint = previousPos.distanceTo(ap.point)
          const fromDistance = ap.weight || 1
          let avoidFactor = max(0, fromDistance - distToAvoidPoint)/fromDistance
          if (avoidFactor > 0 && !insidePoints[ip]) {
            insidePoints[ip] = seededRandom(randomSeed) > 0.5 ? -1 : 1;
          } else if (avoidFactor <= 0) {
            insidePoints[ip] = 0
          }
          avoidFactor = pow(avoidFactor, 1)
          let angleToAvoidPoint = previousPos.angleTo(ap.point)
          //console.log(angleToAvoidPoint)
          const posDir = initPos.y > ap.point.y ? -1 : 1
          const avoidAngle = (previousPos.angleTo(ap.point) + insidePoints[ip]*maxReflect) * avoidFactor
          
          angleVal += avoidAngle
        })
      }
      scaleSize = psin(angleVal / PI / 3) * 0.1 * scale /1.4;
      
      // if (j == 0) scaleSize = 0.5

      const allowedAngleDiff = PI/9
      let angleDiff = angleVal - previousAngle
      if (abs(angleDiff) > allowedAngleDiff) {
        angleVal = previousAngle + sign(angleDiff) * allowedAngleDiff
      }

      previousAngle = angleVal;
      const currentPos = new THREE.Vector3(
        sin(angleVal) * scaleSize,
        cos(angleVal) * scaleSize,
        sin(i) / 10
      );
      nextPos = previousPos.clone().add(currentPos);
        
      const sunsetPalleteIndex = psin(angleVal / angleCap * PI * 2) * (testPalette2.length - 1);
      const color = lineColor || testPalette2[Math.floor(sunsetPalleteIndex)];
      const previousPosWithOffset = previousPos.clone().add(offset);
      const nextPosWithOffset = nextPos.clone().add(offset);
      drawLine(scene, [previousPosWithOffset, nextPosWithOffset], { lineWidth: lineWidth, color: i === 0 ? 0xffffff : color });
      const dotSeed = round(indexId * 1000) + randomSeed
      const amountOfFlowers = floor(seededRandom(dotSeed)*32)
      if (seededRandom(dotSeed) > 0.99 && amountOfFlowers > 0) {
        for (let ri = 0; ri < amountOfFlowers; ri++) {
          const flowerSize = (randInRange(0.01, 0.04, amountOfFlowers/32)) * dotScale
          //(0.04 * random() + 0.02)/amountOfFlowers
          const circle = new THREE.CircleGeometry(flowerSize, 4);
          const flowerColor = dotColor || flowersPalette2[floor(seededRandom(dotSeed)*flowersPalette2.length)]
          const material = new THREE.MeshBasicMaterial({ color: flowerColor });
          const shape = new THREE.Mesh(circle, material);
        const newX = seededRandom(randomSeed)* 0.4+ nextPos.x  
        const newY = seededRandom(randomSeed2)* 0.4+ nextPos.y  
        shape.position.set(newX, newY, nextPos.z + 0.2);
          scene.add(shape);
        }
      }
      
      previousPos.copy(nextPos);
      points.push(nextPos.clone());
    }
    points = []
   
  }
}

export {
  pattern1
}
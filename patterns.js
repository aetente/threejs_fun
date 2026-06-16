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
  signedAngle,
  seededRandomRange
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

  const lineOpacity = options?.lineOpacity || 1
  const dotOpacity = options?.dotOpacity || 1

  const dotScale = (options?.dotScale || 1)
  const t = options?.t || 0
  
  const dotTextures = options?.dotTextures || null
  
  for (let i = 0; i < limit; i++) {
    
    const insidePoints = []
    const iScale = i/limit
    let nextPos = getRandomPointBetweenPoints(pointsArray, i*100000);
    let previousPos = getRandomPointBetweenPoints(pointsArray, i*22222);
    const initPos = previousPos.clone()
    const idByPos = previousPos.x + previousPos.y + previousPos.z
    previousAngle = initAngle
    // const randomDir = seededRandom(randomSeed+i*567) > 0.5 ? 1 : -1
    const randomDir = i % 2 === 0 ? 1 : -1
    // const randomDir = random() > 0.5 ? 1 : -1
    for (let j = 0; j < maxLines; j++) {
      // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
      const previousPosV2 = new THREE.Vector2(previousPos.x, previousPos.y)
      //const indexId = sin((i+j)/10)
      const indexId = i + j*limit
      const jScale = sin(j/maxLines * p2  + indexId)
      const distToRef = previousPos.distanceTo(refPoint)+1
      const angleCap = PI*2
      //const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      
      // const angleChange = jScale* sin(
      //   sin(0.5*sin(indexId*PI) + idByPos / 100)
      //   * PI
      // ) * angleCap

      const ti = t * (indexId + 1)
      
      const angleChange = sin( sin(idByPos / 100 + ti/20) * PI * 2 + ti/20) * PI/20 * randomDir
      //const angleChange = sin(i + idByPos) * angleCap
      //const angleChange = 0
      
      //const correctAngle = angleChange + ((desiredAngle - angleChange)%p2)/1
      //let distFactor = min(1,1/(2*distToRef-1))
      //let distFactor = 1
      const distThreshold = 2
      let distFactor = max(1*min(distThreshold, distToRef - distThreshold),0)
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
      const maxAllowedAngleDiff = PI/3
      const minAllowedAngleDiff = PI/9
      
      const allowedAngleDiff = pow(10,-scaleSize) * (maxAllowedAngleDiff - minAllowedAngleDiff) + minAllowedAngleDiff

      //const allowedAngleDiff = PI/9
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
      drawLine(scene, [previousPosWithOffset, nextPosWithOffset], { lineWidth: lineWidth, color: i === 0 ? color : color, opacity: lineOpacity });
      const dotSeed = round(indexId * 1000) + randomSeed
      const maxAmountOfFlowers = 32
      const amountOfFlowers = floor(seededRandom(dotSeed)*maxAmountOfFlowers)
      const dotsAppearanceByIndexThreshold = maxLines - maxLines/7
      if (seededRandom(dotSeed) > 0.69 && amountOfFlowers > 0 && j > dotsAppearanceByIndexThreshold) {
        for (let ri = 0; ri < amountOfFlowers; ri++) {
          const flowerSize = (randInRange(0.01, 0.04, amountOfFlowers/maxAmountOfFlowers)) * dotScale
          //(0.04 * random() + 0.02)/amountOfFlowers
          // const circle = new THREE.CircleGeometry(flowerSize, 4);
          const planeG = new THREE.PlaneGeometry(flowerSize, flowerSize)
          const flowerColor = dotColor || flowersPalette2[floor(seededRandom(dotSeed)*flowersPalette2.length)]
          const flowerTexture = dotTextures?.length ? dotTextures[floor(random()*dotTextures.length)] : null
          
          const material = flowerTexture ?
            new THREE.MeshBasicMaterial({ map: flowerTexture, transparent: true })
            : new THREE.MeshBasicMaterial({ color: flowerColor, transparent: true, opacity: dotOpacity });
            const shape = new THREE.Mesh(planeG, material);
          const dotDist = 0.5
          const dotRandom1 = seededRandomRange(-1,1,randomSeed + ri + indexId)
          const dotRandom2 = seededRandomRange(-1,1,randomSeed2 + ri + indexId)
          const newX = dotRandom1* dotDist + nextPos.x  
          const newY = dotRandom2* dotDist + nextPos.y  
          shape.rotation.z = seededRandomRange(0,2*PI,dotSeed + ri + indexId)
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

const genPosArray = (amountOfElements) => {
  const posArray = []
  const sizePos = 3
  for (let i = 0; i < amountOfElements; i++) {
    posArray.push(new THREE.Vector3(
      seededRandomRange(-1,1,i*1351234656)*sizePos,
      seededRandomRange(-1,1,i*45673464)*sizePos,
    0));
  }
  return posArray
}
const hardCodeAmountOfElements = 1
let prevPos = genPosArray(hardCodeAmountOfElements)

const swarm1 = (scene, options) => {
  const amountOfElements = options?.amountOfElements || hardCodeAmountOfElements;
  const t = options?.t || 0
  const newPos = []
  const textures = options?.textures || null
  const scale = options?.scale || 0.8
  const pointToFollow = options?.pointToFollow || new THREE.Vector3(0,0,0)
  for (let i = 0; i < amountOfElements; i++) {
    const prevPosVal = prevPos[i].clone()
    const moveAngle = sin(t/2)*PI

    const newPointToFollow = new THREE.Vector3(
      sin(moveAngle)/1,
      cos(moveAngle)/1,
      0
    )
    
    const desiredAngle = Math.atan2(newPointToFollow.y - prevPosVal.y, -(newPointToFollow.x - prevPosVal.x))

    // const angleDiff = desiredAngle - moveAngle

    const movePos = new THREE.Vector3(
      sin(desiredAngle)/4,
      cos(desiredAngle)/4,
      0
    )
    // console.log(movePos)
    const newPosVal = prevPosVal.clone().add(movePos)
    newPos.push(newPosVal)

    const planeG = new THREE.PlaneGeometry(scale, scale)

    const dist = (newPosVal.distanceTo(prevPosVal))

    const maxSpriteSpeed = 8
    const minSpriteSpeed = 4
    const spriteSpeed = pow(1.2,-dist) * (maxSpriteSpeed - minSpriteSpeed) + minSpriteSpeed
    const textureIndex = floor((t*spriteSpeed)%textures.length)
    const texture = textures[textureIndex].clone()

    
    const dx = newPosVal.x - prevPosVal.x;
    const dy = newPosVal.y - prevPosVal.y;
    

    let angleVal = Math.atan2(dy, -dx) - PI/2;
    angleVal = (angleVal + 3*PI/2) % (2*PI)
    //angleVal = t%(2*PI)
    //angleVal = desiredAngle + PI/2

    if (angleVal > PI/2 && angleVal < 3*PI/2) {
      // console.log(angleVal)
      texture.flipY = false
      texture.needsUpdate = true
    } 
    else  {
      texture.flipY = true
      texture.needsUpdate = true
    }

    // angleVal += PI


    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    const shape = new THREE.Mesh(planeG, material);

    shape.rotation.z = angleVal
    // if (abs(newPosVal.x) > 3 || abs(newPosVal.y) > 3) {
    //   newPosVal.x = 0
    //   newPosVal.y = 0
    // }
    shape.position.set(newPosVal.x, newPosVal.y, newPosVal.z);
    //shape.position.set()
    scene.add(shape);
    prevPos[i] = newPosVal.clone()
  }
}

export {
  pattern1,
  swarm1
}
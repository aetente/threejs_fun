import * as THREE from 'three';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import { Vector3, MathUtils } from 'three';
import {
  isPointInPolygon,
  psin,
  pcos,
  pCos,
  lerpAlongPath,
  getRandomPointBetweenPoints,
  drawLine,
  randInRange,
  signedAngle,
  seededRandomRange,
  triangle,
  ptriangle,
  loadTextureF
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
const {seededRandom, lerp, smoothstep} = MathUtils
const p2 = PI*2


const explosion1 = await loadTextureF('/assets/textures/explosion/explosion1.png')
const explosion2 = await loadTextureF('/assets/textures/explosion/explosion2.png')
const explosion3 = await loadTextureF('/assets/textures/explosion/explosion3.png')
const explosion4 = await loadTextureF('/assets/textures/explosion/explosion4.png')
const explosion5 = await loadTextureF('/assets/textures/explosion/explosion5.png')
const explosion6 = await loadTextureF('/assets/textures/explosion/explosion6.png')
const explosion7 = await loadTextureF('/assets/textures/explosion/explosion7.png')
const explosion8 = await loadTextureF('/assets/textures/explosion/explosion8.png')
const explosion9 = await loadTextureF('/assets/textures/explosion/explosion9.png')

const explosionsTextureArray = [explosion1, explosion2, explosion3, explosion4, explosion5, explosion6, explosion7, explosion8, explosion9]

function norm(x, base, spread) {
  return base^(-(x*x)/spread)
}

const randomSeed = 56764448754;
const randomSeed2 = 5674433568754;

function pattern1(scene, pointsArray, options) {
  let limit = options?.limit || 170;
  let maxLines = options?.maxLines || 110
  const scale = options?.scale || 2;
  const offset = options?.offset || new THREE.Vector3(0, 0, -0.5);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const refPoint = options?.refPoint || new Vector3(0,0,0)
  const refPointV2 = new THREE.Vector2(refPoint?.x || 0, refPoint?.y || 0)
  const initAngle = options?.initAngle || 0
  
  let desiredAngle = options?.desiredAngle || 0;
  let previousDesiredAngle = desiredAngle
  let scaleSize = 0.05 * scale
  let points = [];
  let drawnPoints = [];
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
  
  const noDrawing = options?.noDrawing || false
  
  const colorArray = options?.colorArray || []
  
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
      const angleCap = PI/6
      //const angleChange = sin( sin(20*i + idByPos) * angleCap) * angleCap
      
      // const angleChange = jScale* sin(
      //   sin(0.5*sin(indexId*PI) + idByPos / 100)
      //   * PI
      // ) * angleCap

      const ti = t * (indexId + 1)
      
      const indexFactor = min(8*j/maxLines,1)
      
      const angleChange = 
      // 0
      //(
        sin(
        pow(sin(j/(200 + 1800*psin(t))+t/2),1)
        *PI*(4 + 4*psin(t))
      )*PI/2
      //*cos(
        //pow(cos(j/(200 + 1800 * psin(t)) + t / 2), 1) *PI * (4 + 4 * psin(t))
      //))*PI/20
      +(1-indexFactor)*20
      // -sin(pow(sin(j/20+t/2),3)*2*PI)*1
      //sin(sin(t/200 + idByPos/100 - j/1000)*PI * (pow(j/maxLines,200) + 1)*10) * angleCap* randomDir
      // sin(sin(j /10) * idByPos/20) * angleCap* randomDir
      //const angleChange = 0
      
      //const correctAngle = angleChange + ((desiredAngle - angleChange)%p2)/1
      //let distFactor = min(1,1/(2*distToRef-1))
      //let distFactor = 1
      const distThreshold = 1
      
      
      let distFactor = max(1*min(distThreshold, distToRef - distThreshold),0)
      // distFactor = (pow(1.06, -(distToRef))) * (1-0) + 0
      distFactor = (1-pow(2, -(distToRef)/20)) * (1-0) + 0
      //distFactor = 0
      distFactor*=indexFactor
      angleVal = previousAngle + angleChange
      if (angleToRef) {
        
        // desiredAngle = signedAngle( previousPosV2, refPointV2)
        // Angle of point B relative to point A
        const dx = refPoint.x - previousPos.x;
        const dy = refPoint.y - previousPos.y;

        let angleRadians = Math.atan2(dy, -dx);
        // if (angleRadians < 0) {
        //   angleRadians += 4 * Math.PI;
        // } 
        desiredAngle = angleRadians 
         - PI/2
        //Math.atan2(sin(angleRadians), cos(angleRadians))
          // angleRadians
          // angleRadians - PI/2
          // (angleRadians + 3*PI/2) % (2*PI)
          // previousPosV2.angleTo(refPointV2)
          // if (desiredAngle < 0) {
          //   desiredAngle += 2 * PI;
          // }

        // quick fix for angle jumping
        // if (j > 0) {
        //   if (desiredAngle - previousDesiredAngle > PI) {
        //     desiredAngle -= 2*PI
        //   } else if (desiredAngle - previousDesiredAngle < -PI) {
        //     desiredAngle += 2*PI
        //   }
        // }

        previousDesiredAngle = desiredAngle
        // console.log(previousPosV2, refPointV2, desiredAngle)

        //j % 50 == 0 && 
        //console.log(desiredAngle, previousPosV2)
      }
      const avoidAngles = []
      const angleValDiff = desiredAngle - angleVal
      const angleValDiffNorm = Math.atan2(sin(angleValDiff), cos(angleValDiff))
      angleVal = 
        //desiredAngle
        //angleVal
        //+ (desiredAngle - angleVal%(2*PI))/2
        angleVal
        + angleValDiffNorm
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
        0
      );
      nextPos = previousPos.clone().add(currentPos);
        
      const sunsetPalleteIndex = psin(angleVal / angleCap * PI * 2) * (testPalette2.length - 1);
      const color = lineColor || testPalette2[Math.floor(sunsetPalleteIndex)];
      const previousPosWithOffset = previousPos.clone().add(offset);
      // const nextPosWithOffset = nextPos.clone().add(offset);



      const lineSeparation = psin(j*100 + t * 1.3) < 0.2 ? 1 : 0.1
      const nextPosWithOffset = previousPosWithOffset.clone().lerp(nextPos, lineSeparation).add(offset)
      if (!noDrawing) {
        const actualLineWidth = ((maxLines - j)/maxLines * (4-1) + 1) * 1
        const colorProgress = psin(j/100)*colorArray.length
        const colorLerp = colorProgress % 1
        
        const currentColorIndex = floor(colorProgress)
        const nextColorIndex = (currentColorIndex + 1)%colorArray.length
        
        const color1 = colorArray[currentColorIndex] ? new THREE.Color(colorArray[currentColorIndex]) : null
        const color2 = colorArray[nextColorIndex] ? new THREE.Color(colorArray[nextColorIndex]) : null
        
        
        
        const colorValue = color1?.lerp(color2, colorLerp)
        drawnPoints.push(
          drawLine(scene, [previousPosWithOffset, nextPosWithOffset], { lineWidth: actualLineWidth, color: colorArray.length > 0 ? colorValue : color, opacity: lineOpacity })
          
        );
      }
      const dotSeed = round(indexId * 1000) + randomSeed
      const maxAmountOfFlowers = 32
      const amountOfFlowers = floor(seededRandom(dotSeed)*maxAmountOfFlowers)
      const dotsAppearanceByIndexThreshold = 0
      //maxLines - maxLines/7
      if (seededRandom(dotSeed) > 10.64 + 0.1*j/maxLines && amountOfFlowers > 0 && j > dotsAppearanceByIndexThreshold) {
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
      // points.push(nextPos.clone());
      points.push([previousPosWithOffset, nextPosWithOffset])
    }
    //points = []
   
  }
  return {positions: points, mesh: drawnPoints}
}

const explosions = []

const spawnExplosion = (scene, options) => {
  const amountOfElements = options?.amountOfElements || 100;
  const position = options?.position || new THREE.Vector3(0,0,0);
  const explosionMeterial = new THREE.MeshBasicMaterial({ map: explosion1, transparent: true, opacity: 1 });
  const explosionGeometry = new THREE.PlaneGeometry(1, 1);
  const explosionShape = new THREE.Mesh(explosionGeometry, explosionMeterial);
  explosionShape.position.set(position.x, position.y, position.z);
  scene.add(explosionShape);
  explosions.push({
    amountOfElements,
    position,
    time: 0,
    timeAlive: 20,
    scale: 0.5 + random()*2,
    shape: explosionShape
  })
}

const processExplosions = (scene) => {
  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i]
    explosion.time += 1
    explosion.shape.scale.set(
      explosion.time/explosion.timeAlive * explosion.scale,
      explosion.time/explosion.timeAlive * explosion.scale,
      explosion.time/explosion.timeAlive* explosion.scale
    )
    const currentExplosionTexture = explosionsTextureArray[floor(explosion.time/explosion.timeAlive*explosionsTextureArray.length)]
    explosion.shape.material.map = currentExplosionTexture
    if (explosion.time > explosion.timeAlive) {
      scene.remove(explosion.shape)
      explosions.splice(i, 1)
      i--
    }
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
const hardCodeAmountOfElements = 1000
let prevPos = genPosArray(hardCodeAmountOfElements)

let timeCount = 1
let timeSeed = 0

const pigeons = {}
const swarm1 = (scene, options) => {
  processExplosions(scene)
  const amountOfElements = options?.amountOfElements || hardCodeAmountOfElements;
  const t = options?.t || 0
  const newPos = []
  const textures = options?.textures || null
  const scale = options?.scale || 0.4
  const pointToFollow = options?.pointToFollow || null
  const avoidPoints = options?.avoidPoints || [
    //0
    //new THREE.Vector3(0,4,0), new THREE.Vector3(0,4,0), 0 ,0,0,0,0,0,0
    
  ]
  let previousDesiredAngle = 0
  let currentAngle = 0
  
  const colorArrTrace = ["#177E89", "#00A878", "#FFCB47"]
  timeCount += 1
  
  if (timeCount > 20) {
    timeSeed += 1
    timeCount = 0
  }
  
  for (let i = 0; i < amountOfElements; i++) {
    const isFollow = i != 0 && prevPos[0] || true
    const randomDotIndex = floor(seededRandom(i) * amountOfElements)
    const prevPosVal = prevPos[i].clone()
    const wi = smoothstep(i/amountOfElements, 0, 1)
    const wi2 = wi * (4 - 1) + 1
    const wi3 = (psin(i/1)*(2-1)+1)/1000
    
    // point to follow
    const moveAngle = t/2+(psin(t/20)*0.5 + 0.5 + i)*2*PI + i
    const minPos = -8
    const maxPos = 8
    let newPointToFollow = pointToFollow || new THREE.Vector3(
      //seededRandom(timeSeed) * (maxPos - minPos) + minPos,
      //seededRandom(timeSeed+100) * (maxPos - minPos) + minPos,
      sin(moveAngle)*8,
      cos(moveAngle)*8,
      0
    )
    if (isFollow && false) {
      newPointToFollow = prevPos[0]
    }
    let desiredAngle = Math.atan2(newPointToFollow.y - prevPosVal.y, -(newPointToFollow.x - prevPosVal.x))
    desiredAngle -= PI/2
    const desiredAngleDiff = desiredAngle - currentAngle
    let desiredAngleDiffNorm = Math.atan2(sin(desiredAngleDiff), cos(desiredAngleDiff))
    //desiredAngleDiffNorm -= PI/2

    const distToPoint = prevPosVal.distanceTo(newPointToFollow)
    
    
    
    const randomAngle = 
      //currentAngle + 0.1*random()
      //currentAngle + i*0.6
      //0
      //PI*2 + i/100
      round(psin(t + i)) * PI + PI/2
    const randomAngleDiff = randomAngle - desiredAngle
    const randomAngleDiffNorm = Math.atan2(sin(randomAngleDiff), cos(randomAngleDiff))
    // const distF = lerp(30, 1, distToPoint)
    const maxDistF = 1
    const minDistF = 0

    let distF = pow(1.2 + (0*pcos(i + t)), -distToPoint) * (maxDistF-minDistF) + minDistF
    if (!isFollow) {
      distF = pow(4, -distToPoint) * (maxDistF-minDistF) + minDistF
    }
    if (distF < 0.1) {
      distF = 0.1
    }
    let actualAngle = 0
    // distF:
    // bigger value is random
    // smaller value is follow
    actualAngle = randomAngle - randomAngleDiffNorm/distF
    // distF:
    // bigger value is more random
    // smaller value is follow
    //actualAngle = (1-distF)*desiredAngleDiffNorm + (distF)*randomAngle
    if (pigeons[String(i)]?.fall) {
      pigeons[String(i)].fallAngle += 0.05
      if (pigeons[String(i)].fallAngle > 1) {
        pigeons[String(i)].fallAngle = 1
      }
      actualAngle = sqrt(pigeons[String(i)].fallAngle)* PI * pigeons[String(i)].fallOrder
    }

    const randomPigeonCheckIndex = floor(random() * amountOfElements)
    if (false && isFollow && pigeons[String(randomPigeonCheckIndex)] && pigeons[String(i)] && !pigeons[String(i)]?.fall && !pigeons[String(randomPigeonCheckIndex)]?.fall) {
      const isFall =
        pigeons[String(i)].shape.position.distanceTo(pigeons[String(randomPigeonCheckIndex)].shape.position) < 0.01
        && pigeons[String(i)].shape.position.y > -40
        && seededRandom(t * 324234234 + i * 344468) > 0.0
      // seededRandom(t * 324234234 + i * 344468) > 0.999
      pigeons[String(i)].fall = isFall
      pigeons[String(randomPigeonCheckIndex)].fall = isFall
      pigeons[String(i)].fallAngle = 0
      pigeons[String(randomPigeonCheckIndex)].fallAngle = 0
      pigeons[String(i)].fallOrder = 1
      pigeons[String(randomPigeonCheckIndex)].fallOrder = -1
      if (isFall) {
        spawnExplosion(scene, { position: pigeons[String(i)].shape.position })
      }
    }
    
    let addSpeed = 0
    avoidPoints.forEach((avoidPoint, j) => {
      const fakePoint = new THREE.Vector3(sin(j + t*4)*5, cos(1.2*j + t*4)*5, 0)
      const ap = fakePoint
      let avoidAngle = Math.atan2(ap.y - prevPosVal.y, -(ap.x - prevPosVal.x))
      avoidAngle += PI/2
      const avoidAngleDiff = randomAngle - avoidAngle
      const avoidAngleDiffNorm  = Math.atan2(sin(avoidAngleDiff), cos(avoidAngleDiff))
      const distToAvoidP = prevPosVal.distanceTo(ap)
      const maxAvoidDistF = 30
      const minAvoidDistF = 1
      // upside down
      // the closer to point, the less value
      // const avoidDistF = -pow(2, -distToAvoidP) * (maxDistF-minDistF) + maxDistF
      const alterDist = pow(distToAvoidP/8, 0.5)
      const avoidDistF  = smoothstep(distToAvoidP, 0, 1)  * (maxDistF-minDistF) + minDistF
      
      // actualAngle = actualAngle - avoidAngleDiffNorm/avoidDistF
      // addSpeed += 1/avoidDistF
      // console.log(addSpeed)
      if (distToAvoidP < 1) {
        addSpeed += 0.1
        actualAngle = avoidAngle
      }

      const circle = new THREE.CircleGeometry(0.125, 32);
      const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
      const shape = new THREE.Mesh(circle, material);
      shape.position.set(ap.x, ap.y, 0);
      scene.add(shape);
    })
    
    currentAngle = randomAngle
    
    const pickPigeons = i > amountOfElements/8 && false
    // movement speed
    const minSpeed = 0.001
    const maxSpeed = pickPigeons ? 10.6 : 0.6
    const funnyModifySpeed = pickPigeons ? psin(t/1 + 0) : 1
    let speed = (funnyModifySpeed - pow(1.03,-distToPoint)) * (maxSpeed - minSpeed) + minSpeed
    if (!isFollow) {
      speed = 0.2
    }
    if (pigeons[String(i)]?.fall) {
      speed = 0.4
    }
    speed += addSpeed
    // const speed = 0.05
    // const speed = (ptriangle(t/1 + i*45645)*(maxSpeed - minSpeed) + minSpeed)

    const movePos = new THREE.Vector3(
      sin(actualAngle)*speed,
      cos(actualAngle)*speed,
      0
    )
    const newPosVal = prevPosVal.clone().add(movePos)
    if (pigeons[String(i)]?.fall && newPosVal.y < -16) {
      pigeons[String(i)].fall = false
    }

    newPos.push(newPosVal)

    let sizeVal = seededRandomRange(0.5,2,i)
    if (!isFollow) {
      sizeVal = 4
    }
    const planeG = new THREE.PlaneGeometry(sizeVal * scale, sizeVal * scale)

    // distance from last point
    // the faster speed of dot, the lower sprite speed
    // TODO: probably can use the speed defined above
    const dist = (newPosVal.distanceTo(prevPosVal))
    // sprite speed
    const maxSpriteSpeed = 15
    const minSpriteSpeed = 7
    const spriteSpeedThreshold = minSpriteSpeed + (maxSpriteSpeed - minSpriteSpeed)/8
    let spriteSpeed = pow(100,-dist) * (maxSpriteSpeed - minSpriteSpeed) + minSpriteSpeed
    spriteSpeed *= 3
    const textureIndex = spriteSpeed < spriteSpeedThreshold ? 0 : floor((t*spriteSpeed + i)%textures.length)
    const texture = textures[pigeons[String(i)]?.fall ? 0 : textureIndex].clone()

    // rotate the pigeon acrding to where it moves
    // TODO: probably can use angle defined above currentAngle 
    const dx = newPosVal.x - prevPosVal.x;
    const dy = newPosVal.y - prevPosVal.y;
    let angleVal = Math.atan2(dy, dx);
    angleVal = (angleVal + 2*PI) % (2*PI)

    if (angleVal > PI/2 && angleVal < 3*PI/2) {
      texture.flipY = false
      texture.needsUpdate = true
    } 
    else  {
      texture.flipY = true
      texture.needsUpdate = true
    }


    const multiplyColor = pigeons[String(i)]?.fall ? new THREE.Color("#b370ff") : new THREE.Color("#ffffff")
    const pigeonColor = new THREE.Color(isFollow ? colorArrTrace[floor(random() * (colorArrTrace.length))] : "#DF2935")

   if (!pigeons[String(i)]) {

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uColor: { value:  pigeonColor },
          multiplyColor: { value: multiplyColor },
          uThreshold: { value: 0.05 } // Adjust threshold as needed
        },
        transparent: true,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform vec3 uColor;
          uniform vec3 multiplyColor;
          uniform float uThreshold;
          varying vec2 vUv;

          vec3 linearToSRGB(vec3 color) {
            return pow(color, vec3(1.0 / 2.2));
          }

          vec3 blendOverlay(vec3 base, vec3 blend) {
            return vec3(
              (base.r < 0.5) ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r)),
              (base.g < 0.5) ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g)),
              (base.b < 0.5) ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b))
            );
          }

          vec3 blendSoftLight(vec3 base, vec3 blend) {
            return (1.0 - 2.0 * blend) * base * base + 2.0 * blend * base;
          }

          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            float originalAlpha = texture2D(uTexture, vUv).a;

            vec3 luminanceWeights = vec3(0.2126, 0.7152, 0.0722);
            float gray = dot(texColor.rgb, luminanceWeights);

            float luminance = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722));

            vec3 tintedColor = vec3(gray) * linearToSRGB(uColor);
            // vec3 tintedColor = uColor * luminance;

            // vec3 blendedColor = blendOverlay(texColor.rgb, uColor);
            vec3 blendedColor = blendSoftLight(texColor.rgb, uColor);

            // vec3 linearTexColor = linearToSRGB(texColor.rgb);
            // vec3 linearTexColor = linearToSRGB(tintedColor);
            // vec3 linearTexColor = linearToSRGB(blendedColor);
            vec3 linearTexColor = linearToSRGB(uColor);


            // vec3 finalColor = linearTexColor.b * uColor;
            vec3 finalColor = linearTexColor * multiplyColor;
            // vec3 finalColor = mix(texColor.rgb, tintedColor, 0.5);
            
            // If alpha > threshold, set it to 1.0 (fully opaque). Otherwise 0.0.
            float binaryAlpha = step(uThreshold, originalAlpha) * 1.0;
            
            gl_FragColor = vec4(finalColor, binaryAlpha);

          }
        `
      });

      // const material = new THREE.MeshBasicMaterial({ alphaTest: 0.2, color: colorArrTrace[floor(psin(t/2 + i) * (colorArrTrace.length-1))], alphaMap: texture, transparent: true, depthWrite: false })
      const shape = new THREE.Mesh(planeG, material);

      shape.rotation.z = angleVal
      shape.position.set(newPosVal.x, newPosVal.y, newPosVal.z);
      //shape.position.set()
      scene.add(shape);
      pigeons[String(i)] = {
        fall: false,
      }
      pigeons[String(i)].shape = shape
    } else {
      pigeons[String(i)].shape.material.uniforms.multiplyColor.value = multiplyColor
      pigeons[String(i)].shape.material.uniforms.uTexture.value = texture
      // pigeons[String(i)].material.alphaMap = texture
      pigeons[String(i)].shape.rotation.z = angleVal
      pigeons[String(i)].shape.position.set(newPosVal.x, newPosVal.y, newPosVal.z);
    }
    if (!isFollow && false) {
      const randColor = colorArrTrace[floor(random() * (colorArrTrace.length))]
      const circle = new THREE.CircleGeometry(0.05, 8);
      const material = new THREE.MeshBasicMaterial({ color:
        // "#CCFF00"
        // "#44FF99"
        // "#2F4858"
        randColor,
        transparent: true,
        opacity: 0.9
      });
      const shape = new THREE.Mesh(circle, material);
      shape.position.set(newPosVal.x, newPosVal.y, -1);
      scene.add(shape);
      /////
      const circle2 = new THREE.CircleGeometry(0.1, 32);
      const material2 = new THREE.MeshBasicMaterial({ color: 
        // "#ff007f"
        // "#FF7700"
        // "#D4A373"
        "#606C38",
        
      });
      const shape2 = new THREE.Mesh(circle2, material2);
      shape2.position.set(newPointToFollow.x, newPointToFollow.y, -2);
      //scene.add(shape2);
    }
    prevPos[i] = newPosVal.clone()
  }
}

export {
  pattern1,
  swarm1
}
import * as THREE from 'three';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import { Vector3 } from 'three';
import {
  isPointInPolygon,
  psin,
  lerpAlongPath,
  getRandomPointBetweenPoints
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
  sunsetPallete2
}
from "./consts.js"

const {sin, cos, PI, random, pow, floor, abs} = Math;


const palletePos = [
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(2,0,0),
]

function fillStarsBackground (scene) {
  const maxStars = 10000
  const stars = []
  const backgroundSize = 4.4
  const divideBackground = 10
  const cellSize = backgroundSize / divideBackground

  for (let i = 0; i < maxStars; i++) {
    const randomSunsetPaletteIndex = floor(random() * sunsetPallete2.length);
    const material = new THREE.MeshBasicMaterial({
      color: sunsetPallete2[randomSunsetPaletteIndex]
    });
    const size = psin(i * 2333) * 0.003 + 0.002
    const startGeometry = new THREE.CircleGeometry(size, 32);
    const star = new THREE.Mesh(startGeometry, material);

    star.position.set(sin(i*3456 - 8) * 2.2, cos(i*123) * 2.2, -1);
    scene.add(star);
    stars.push(star)
  }

}

function curls(scene, offsetVal, scaleVal) {
  const offset = offsetVal.clone() || new THREE.Vector3(0,0,0)
  const scale = scaleVal || 1
  const group = new THREE.Group();
  const numLines = 70;
  const numSegments = 40;
  

  for (let i = 0; i < numLines; i++) {
      const segmentLength = (0.01 + random()*0.01) * scale;
      const points = [];
      // Starting point for each line (staggered slightly so they don't overlap)
      const scaleSize = 0.1 * scale
      const k = i/numLines
      const azimuth = 
      // 0
      sin(k * PI * 2) * PI * 0.5
        - PI * 0.4
      const phi = sin(k * PI * 2) * PI * 0.9
      let currentPos = new THREE.Vector3(
        sin(azimuth) * scaleSize + offset.x,
        cos(azimuth) * scaleSize + offset.y,
        0 + offset.z
        // cos(azimuth) * scaleSize
      );
      points.push(currentPos.clone());

      let previousDirection = new THREE.Vector2(0, 0);
      let previousAngle = new THREE.Vector2(0,0);
      const curveDirection = random() > 0.5 ? 1 : -1
      for (let j = 0; j < numSegments; j++) {

          // Generate a random unit vector (direction)
          const segmentGrow = j/numSegments
          let segmentGrow2 = (Math.sin(i + 10)*10 + j / numSegments) *0
          const segmentExp = (100+i/10)  *pow(segmentGrow, 1.2)
          let segmentDecrease = (numSegments - j) / numSegments
          let segmentAngle = 10*j;
          let adjustAngle = new THREE.Vector2(
            curveDirection * segmentExp * 0.003,
            curveDirection * segmentExp * 0.003
          )
          let nextAngle = previousAngle.clone()
          nextAngle.add(adjustAngle)
          previousAngle = nextAngle.clone()
          const randomDirection = new THREE.Vector2(
              //Math.sin(10*(i+j)),
              //Math.sin(10*(i+j)),
              // Math.sin(10*(i+j))
              
              //segmentGrow + 1,
              //segmentGrow + 1

              // 0.1+segmentGrow * (Math.random() - 0.5),
              // 0.1+segmentGrow * (Math.random() - 0.5),
              // 0.1+segmentGrow * (Math.random() - 0.5)

                1*segmentExp * (Math.sin(0.5*(i+j))),
                1*segmentExp * (Math.sin(0.5*(i+j))),
              // 0.1+segmentGrow * (Math.sin(10*(i+j)))
              //0.3,0.3
              
              // 1,1,1
              
              // segmentAngle,segmentAngle,segmentAngle
          );
          
          let nextDirection = previousDirection.clone().add(nextAngle);
          
          previousDirection = nextDirection.clone();
          var adjustDirectionX =
          2.5/2*PI - sin(j/10)
          //PI
          let adjustDirection = new THREE.Vector2(
            adjustDirectionX,
            adjustDirectionX
          )
          nextDirection.add(adjustDirection)

          //console.log(previousDirection, nextDirection)
          // Calculate the next point's position
          // const nextPos = new THREE.Vector3()
          //     .copy(currentPos)
          //     .add(nextDirection.multiplyScalar(segmentLength));
          const nextPos = new THREE.Vector3()

          //nextPos.x = currentPos.x + Math.sin(nextDirection.x) * Math.cos(nextDirection.y) * segmentLength
          //nextPos.y = currentPos.y + Math.cos(nextDirection.x) * Math.cos(nextDirection.y) * segmentLength
          //nextPos.z = currentPos.z + Math.sin(nextDirection.y) * segmentLength
          
          nextPos.x = currentPos.x + sin(nextDirection.x) * segmentLength
          nextPos.y = currentPos.y + cos(nextDirection.x) * segmentLength
          nextPos.z = currentPos.z + sin(nextDirection.y) * segmentLength

          points.push(nextPos.clone());
          currentPos.copy(nextPos);
      }

      // Create Geometry and Material for the line
      // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const flatPath = points.flatMap(v => [v.x, v.y, v.z]);
      // console.log("flatPath", flatPath)
      const geometry = new LineGeometry();
      geometry.setPositions(flatPath);
      // console.log("geometry", geometry)
      const randomColorIndex = Math.floor(Math.random() * hairPallete.length);
      const material = 
      // new THREE.LineBasicMaterial({
      new LineMaterial({
        color: hairPallete[randomColorIndex],
        linewidth: 8, // in world units with size attenuation, pixels otherwise
        // vertexColors: true,
        // depthTest: true,
        // depthWrite: true,
        // dashed: false,
        // alphaToCoverage: true,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
      });

      const line = new Line2(geometry, material);
      group.add(line);
  }

  scene.add(group);
}

function drawHand(scene, position, options) {
  const color = options?.color || 0xffffff
  const scale = options?.scale || 1
  const offset = options?.offset || new THREE.Vector3(0,0,0)
  const rotation = options?.rotation || new THREE.Vector3(0,0,0)
  const handSize = options?.handSize || new THREE.Vector3(1,1,0.1)

  const geometry = new THREE.BoxGeometry(handSize.x, handSize.y, handSize.z);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  mesh.scale.set(scale, scale, scale);
  mesh.position.add(offset);
  scene.add(mesh);
  
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

function linesPatterns(scene, pointsArray, options) {
  const amountOfLines = options?.amountOfLines || 10
  const color = options?.color || 0xffffff
  const scale = options?.scale || 1
  const offset = options?.offset || new THREE.Vector3(0,0,0)
  const rotation = options?.rotation || 0
  const lineLength = options?.lineLength || 1
  const lineWidth = options?.lineWidth || 2
  const dashSize = options?.dashSize || 0
  const gapSize = options?.gapSize || 0

  
  for (let i = 0; i < amountOfLines; i++) {
    const lerpFactor = i/amountOfLines
    const startPoint = lerpAlongPath(pointsArray, i/amountOfLines).add(offset)
    const direction = new THREE.Vector3(
      Math.cos(rotation),
      Math.sin(rotation),
      0
    )
    const endPoint = startPoint.clone().add(direction.multiplyScalar(lineLength))
    const points = [startPoint, endPoint]

    drawLine(scene, points, {color, lineWidth, dashSize, gapSize})
  }

}

function basicCloth(scene, pointsArray, options) {
  const scale = options?.scale || 1
  // const start = startVal.clone() || new THREE.Vector3(0,0,0)
  // const end = endVal.clone() || new THREE.Vector3(0,0,0)
  const color = options?.color || 0x000000
  const offset = options?.offset || new THREE.Vector3(0,0,-0.1)


  const coatShape = new THREE.Shape();
  coatShape.moveTo( pointsArray[0].x, pointsArray[0].y );
  pointsArray.forEach(point => {
    coatShape.lineTo( point.x, point.y );
  })
  coatShape.lineTo( pointsArray[0].x, pointsArray[0].y );
  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: false,
    bevelThickness: 0.5,
    bevelSize: 2,
    bevelOffset: -2,
    bevelSegments: 3
  };
  const extrudeGeometry = new THREE.ExtrudeGeometry(coatShape, extrudeSettings);
  const extrudeMaterial = new THREE.MeshBasicMaterial({ color });
  const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
  extrudeMesh.position.set(offset.x, offset.y, offset.z);
  extrudeMesh.rotation.set(0, 0, 0);
  extrudeMesh.scale.set(scale, scale, scale);
  scene.add(extrudeMesh);

}

function crazyCloth1(pointsArray, options) {
  var shape=
  [[-200,0,163,183,219],
  [0,-200,246,175,175],
  [200,0,167,82,112],
  [0,200,19,14,73]];
  const scale = options?.scale || 1
  const amountOfDots = options?.amountOfDots || 300;
  const offset = options?.offset || new THREE.Vector3(0,0,0);
  for (let i =0; i < amountOfDots; i++) {
    const lerpFactor = i/amountOfDots
    const accordingArrayIndex = Math.floor(lerpFactor*shape.length)
    const currentPoint = lerpAlongPath(pointsArray, lerpFactor).add(offset)
    const coolDotLerpFactor = sin(i * 3333) * 0.5 + 0.5;
    const coolDot = lerpAlongPath(pointsArray, coolDotLerpFactor).add(offset)
    const points = [currentPoint, coolDot]
    const flatPath = points.flatMap(v => [v.x, v.y, v.z]);
    const geometry = new LineGeometry();
    geometry.setPositions(flatPath);

    const qOfDiscr = amountOfDots
    
    const red = Math.floor((i)*(pointsArray[((accordingArrayIndex+1)%pointsArray.length)].x-pointsArray[accordingArrayIndex].x)/qOfDiscr+pointsArray[accordingArrayIndex].x)+Math.floor(240*Math.sin(i*accordingArrayIndex*i/10)*Math.cos(i*accordingArrayIndex*i/10));
    const green = Math.floor((i)*(pointsArray[((accordingArrayIndex+1)%pointsArray.length)].y-pointsArray[accordingArrayIndex].y)/qOfDiscr+pointsArray[accordingArrayIndex].y)+Math.floor(100*Math.sin(i*i*i/10.1));
    const blue = Math.floor((i)*(pointsArray[((accordingArrayIndex+1)%pointsArray.length)].z-pointsArray[accordingArrayIndex],z)/qOfDiscr+pointsArray[accordingArrayIndex].z)+Math.floor(100*Math.sin(i*i*i/10.2));
    
    const material = 
    new LineMaterial({
      color: new THREE.Color(red, green, blue),
      linewidth: 2, // in world units with size attenuation, pixels otherwise
      // vertexColors: true,
      // depthTest: true,
      // depthWrite: true,
      // dashed: false,
      alphaToCoverage: true,
      opacity: 0.5,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
    });

    const line = new Line2(geometry, material);
    scene.add(line);
  }
}

function brokenPattern1(scene, pointsArray, options) {
  let limit = options?.limit || 500;
  const scale = options?.scale || 1;
  const offset = options?.offset || new THREE.Vector3(0,0,0.1);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const initAngle = (options?.initAngle || random() * PI * 2)
  let scaleSize = 0.05 * scale
  let points = [];
  let angleVal = 0;
  let previousAngle = initAngle;
  let previousPos = initPoint;
  const idByPos = previousPos.x + previousPos.y + previousPos.z
  const lineWidth = 3;
  
  for (let i = 0; i < limit; i++) {
    // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
    const angleCap = PI / 4
    const angleChange = sin( sin(i/50 + idByPos) * PI) * angleCap
    // const angleChange = sin(i/10 + idByPos) * angleCap
    // const angleChange = 0
    // const angleChange = sin(i/1000) * angleCap
    angleVal = previousAngle+angleChange
    scaleSize = abs(angleVal/PI/3) * 0.01 * scale;
    previousAngle = angleVal;
    // console.log("after", angleVal)
    const currentPos = new THREE.Vector3(
      sin(angleVal) * scaleSize,
      cos(angleVal) * scaleSize,
      0
    );
    let nextPos = previousPos.clone().add(currentPos);
    let resetPoint = false
    const isInPolygon = isPointInPolygon(nextPos, pointsArray);
    if (!isInPolygon) {
      resetPoint = random() < 0.1
      if (resetPoint) {
        points = []
        nextPos = getRandomPointBetweenPoints(pointsArray);
        const circleRadius = 0.01 * random() + 0.02;
        const circle = new THREE.CircleGeometry(circleRadius);
        const randomSunsetPaletteIndex = floor(random() * sunsetPallete2.length);
        const material = new THREE.MeshBasicMaterial( { color: sunsetPallete2[randomSunsetPaletteIndex], transparent: true, opacity: 0.4 } );
        const shape = new THREE.Mesh( circle, material );
        shape.position.set(nextPos.x, nextPos.y, nextPos.z + 0.2);
        scene.add( shape );

        const ring = new THREE.RingGeometry(circleRadius - 0.001, circleRadius, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ring, ringMaterial);
        ringMesh.position.set(shape.position.x, shape.position.y, shape.position.z + 0.01);
        scene.add(ringMesh);
      }
    }
    
    if (!resetPoint) {
      
      const lerpFactorForGradient = THREE.MathUtils.inverseLerp(palletePos[0].x, palletePos[1].x, nextPos.x) % 1;
      // console.log(nextPos.x, lerpFactorForGradient)
      // const sunsetPalleteIndex = lerpFactorForGradient * (sunsetPallete.length - 1);
      const sunsetPalleteIndex = psin(angleVal / angleCap * PI * 2) * (sunsetPallete2.length - 1);
      const color = sunsetPallete2[Math.floor(sunsetPalleteIndex)];
      const previousPosWithOffset = previousPos.clone().add(offset);
      const nextPosWithOffset = nextPos.clone().add(offset);
      drawLine(scene, [previousPosWithOffset, nextPosWithOffset], {lineWidth, color});
    }

    previousPos.copy(nextPos);


    points.push(nextPos.clone());

    // const circle = new THREE.CircleGeometry(0.002 * random() + 0.002, 32);
    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    // const shape = new THREE.Mesh( circle, material );
    // const randomOffset = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.1);
    // shape.position.set(nextPos.x + randomOffset.x, nextPos.y + randomOffset.y, nextPos.z + randomOffset.z);
    // scene.add( shape );
  }
  // drawLine(points, {lineWidth});
}

function pattern1(scene, pointsArray, options) {
  let limit = options?.limit || 500;
  const scale = options?.scale || 1;
  const offset = options?.offset || new THREE.Vector3(0,0,0.1);
  const initPoint = options?.initPoint || getRandomPointBetweenPoints(pointsArray);
  const initAngle = (options?.initAngle || random() * PI * 2)
  let scaleSize = 0.05 * scale
  let points = [];
  let angleVal = 0;
  let previousAngle = initAngle;
  let previousPos = initPoint;
  const idByPos = previousPos.x + previousPos.y + previousPos.z
  const lineWidth = 1;
  
  for (let i = 0; i < limit; i++) {
    // scaleSize = (psin(sin(i*2)/10) * 0.1 + 0.05) * scale
    const angleCap = PI / 4
    // const angleChange = sin( sin(i + idByPos) * PI) * angleCap
    // const angleChange = sin(i/10 + idByPos) * angleCap
    const angleChange = 0
    angleVal = previousAngle+angleChange
    scaleSize = abs(angleVal/PI/3) * 0.1 * scale;
    // scaleSize = (1 - abs(angleVal/angleCap / 2) + 0.05) * 0.1 * scale
    // console.log("before", angleVal)
    // angleVal = snapTo90Degrees(angleVal)
    // angleVal = fractionValue(angleVal, PI / 2);
    // if (i !== 0 && angleVal === previousAngle) {
    //   limit++;
    //   previousAngle = angleVal;
    //   continue;
    // }
    previousAngle = angleVal;
    // console.log("after", angleVal)
    const currentPos = new THREE.Vector3(
      sin(angleVal) * scaleSize,
      cos(angleVal) * scaleSize,
      0
      // cos(azimuth) * scaleSize
    );
    let nextPos = previousPos.clone().add(currentPos);
    const isInPolygon = isPointInPolygon(nextPos, pointsArray);
    if (!isInPolygon) {
      points = []
      nextPos = getRandomPointBetweenPoints(pointsArray);
      const circle = new THREE.CircleGeometry(0.002 * random() + 0.02, 32);
      const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      const shape = new THREE.Mesh( circle, material );
      shape.position.set(nextPos.x, nextPos.y, nextPos.z + 0.2);
      scene.add( shape );
    }
    
    if (isInPolygon) {
      
      const lerpFactorForGradient = THREE.MathUtils.inverseLerp(palletePos[0].x, palletePos[1].x, nextPos.x) % 1;
      // console.log(nextPos.x, lerpFactorForGradient)
      // const sunsetPalleteIndex = lerpFactorForGradient * (sunsetPallete.length - 1);
      const sunsetPalleteIndex = psin(angleVal / angleCap * PI * 2) * (sunsetPallete2.length - 1);
      const color = sunsetPallete2[Math.floor(sunsetPalleteIndex)];
      const previousPosWithOffset = previousPos.clone().add(offset);
      const nextPosWithOffset = nextPos.clone().add(offset);
      drawLine(scene, [previousPosWithOffset, nextPosWithOffset], {lineWidth: i == 0 ? 5 : lineWidth, color: i === 0 ? 0x00ff00 : color});
    }

    previousPos.copy(nextPos);


    points.push(nextPos.clone());

    // const circle = new THREE.CircleGeometry(0.002 * random() + 0.002, 32);
    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    // const shape = new THREE.Mesh( circle, material );
    // const randomOffset = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.1);
    // shape.position.set(nextPos.x + randomOffset.x, nextPos.y + randomOffset.y, nextPos.z + randomOffset.z);
    // scene.add( shape );
  }
  // drawLine(points, {lineWidth});
}

function coat1(pointsArray, options) {
  const shapesArray = []
  const scale = options?.scale || 1
  // const start = startVal.clone() || new THREE.Vector3(0,0,0)
  // const end = endVal.clone() || new THREE.Vector3(0,0,0)
  const amountOfRects = options?.amountOfRects || 300;
  const radius = options?.radius || 0;
  const radius2 = options?.radius2 || radius;
  const opacity = options?.opacity || 0.1;
  const offset = options?.offset || new THREE.Vector3(0,0,0);

  var colorRange = 0.9;
  var expSpeed = 1.4;
  
  var sc=200;

  for (let i = 0; i < amountOfRects; i++) {
    const xRes = sin(t)
    const yRes = cos(t)

    //red
    let red = colorRange/(1+pow(expSpeed,-sc*i/(cos((xRes+yRes)*1100)*300)));
    //green
    let green = colorRange/(1+pow(expSpeed,-sc*i/(cos((xRes+yRes)*1300)*300)));
    //blue
    let blue = colorRange/(1+pow(expSpeed,-sc*i/(cos((xRes+yRes)*1200)*300)));

    const lerpVal = i/amountOfRects
    // console.log(lerpVal)
    const currentRadius = THREE.MathUtils.lerp(radius, radius2, lerpVal)
    const randomOffset = new THREE.Vector3(
      currentRadius * (random() - 0.5),
      currentRadius * (random() - 0.5),
      currentRadius * (random() - 0.5)
    )
    // const currentPos = start.clone().lerp(end, lerpVal)
    // console.log(currentPos, lerpVal)
    // currentPos.add(randomOffset)
    const patchSize = (0.01 + random() * 0.02) * scale
    const geometry = new THREE.PlaneGeometry(patchSize, patchSize);
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color().setRGB( red, green, blue ),
      opacity,
      transparent: true
    });
    //const material = new THREE.MeshStandardMaterial({ map: texture, });
    const currentPos = getRandomPointBetweenPoints(pointsArray)
    currentPos.add(randomOffset).add(offset)
    const shape = new THREE.Mesh(geometry, material);
    shape.position.set(currentPos.x, currentPos.y, currentPos.z);
    shape.rotateZ(random() * PI * 2);
    shape.rotateX(random() * PI * 2);
    shape.rotateY(random() * PI * 2);
    shapesArray.push(shape)
    scene.add(shape);
  }
  return shapesArray
}

function face1(scene, position) {
  facePallete.forEach((color, i) => {
    const scaleStripe = 0.08
    const planeSize = 10
    const geometry = new THREE.PlaneGeometry( planeSize, scaleStripe );
    const material = new THREE.MeshBasicMaterial( { color } );
    const shape = new THREE.Mesh( geometry, material );
    shape.position.set(position.x + planeSize/2, position.y - i*scaleStripe, position.z);
    scene.add( shape );
  })
}

export {
  curls,
  crazyCloth1,
  basicCloth,
  linesPatterns,
  drawHand,
  fillStarsBackground,
  face1,
  coat1,
  pattern1,
  brokenPattern1,
  drawLine
}
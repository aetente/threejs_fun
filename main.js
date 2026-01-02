import * as THREE from 'three';

import { Vector3 } from 'three';
import { randInRange, pSin, pCos, distance3D, loadTextureF } from "./utils.js"
import { heartShape, birdShape } from "./shapes.js"
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import {applyPose, tPoseData, casualPoseData, sittingPoseData, sittingPhonePoseData, leapPoseData, relaxedSittingPhoneData, relaxedSittingPhoneAnglesData, rotatePose, sittingLegsClose} from "./poses.js"
//import wall from './assets/textures/wall.jpg';

const {sin, cos, PI, random, pow} = Math;


const palletePos = [
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(2,0,0),
]

var dynamicsVectors = [
  {
    scale: 1,
    vectors: [new Vector3(0,0,0), new THREE.Vector3(0,1,0)],
    type: "c"
  },
  {
    scale: 1,
    vectors: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0)],
    type: "l"
  }
]

// 1. Create the Bones
const root = new THREE.Bone(); // Lower Torso (Root)
const upperTorso = new THREE.Bone();
const lowerTorso = new THREE.Bone();
const head = new THREE.Bone();

const leftShoulder = new THREE.Bone();
const leftElbow = new THREE.Bone();
const leftHand = new THREE.Bone();

const rightShoulder = new THREE.Bone();
const rightElbow = new THREE.Bone();
const rightHand = new THREE.Bone();

const leftLeg = new THREE.Bone();
const leftKnee = new THREE.Bone();
const leftFoot = new THREE.Bone();

const rightLeg = new THREE.Bone();
const rightKnee = new THREE.Bone();
const rightFoot = new THREE.Bone();

root.name = "root";
upperTorso.name = "upperTorso";
lowerTorso.name = "lowerTorso";
head.name = "head";
leftShoulder.name = "leftShoulder";
leftElbow.name = "leftElbow";
leftHand.name = "leftHand";
rightShoulder.name = "rightShoulder";
rightElbow.name = "rightElbow";
rightHand.name = "rightHand";
leftLeg.name = "leftLeg";
leftKnee.name = "leftKnee";
leftFoot.name = "leftFoot";
rightLeg.name = "rightLeg";
rightKnee.name = "rightKnee";
rightFoot.name = "rightFoot";


root.add(upperTorso);
root.add(head);
root.add(leftShoulder);
root.add(rightShoulder);

upperTorso.add(lowerTorso)

leftShoulder.add(leftElbow);
leftElbow.add(leftHand);

rightShoulder.add(rightElbow);
rightElbow.add(rightHand);

lowerTorso.add(leftLeg);
lowerTorso.add(rightLeg);

leftLeg.add(leftKnee);
leftKnee.add(leftFoot);

rightLeg.add(rightKnee);
rightKnee.add(rightFoot);


// root.add(lowerTorso);

// lowerTorso.add(upperTorso)

// upperTorso.add(head);
// upperTorso.add(leftShoulder);
// upperTorso.add(rightShoulder);


// leftShoulder.add(leftElbow);
// leftElbow.add(leftHand);

// rightShoulder.add(rightElbow);
// rightElbow.add(rightHand);

// lowerTorso.add(leftLeg);
// lowerTorso.add(rightLeg);

// leftLeg.add(leftKnee);
// leftKnee.add(leftFoot);

// rightLeg.add(rightKnee);
// rightKnee.add(rightFoot);

// 4. Create the Skeleton
const bones = [
    root, upperTorso, lowerTorso, head, 
    leftShoulder, leftElbow, leftHand, 
    rightShoulder, rightElbow, rightHand,
    leftLeg, leftKnee, leftFoot, 
    rightLeg, rightKnee, rightFoot
];
const skeleton = new THREE.Skeleton(bones);

const main = async () => {

  const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);

  const totalWidth = 3000
  const totalHeight = 3000

  camera.position.z = 4;
  camera.position.x = 0.3

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true // Required for capturing the image
  });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(3000,3000)
  document.body.appendChild(renderer.domElement);



  const texture = await loadTextureF(
    '/assets/textures/wall.jpg'
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  
  function doDymanicsLines(lines) {
    lines.forEach((line,i) => {
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff
      });
  
      const points = [];
      points.push(new THREE.Vector3(- 1, 0, 0));
      points.push(new THREE.Vector3(0, 1, 0));
      points.push(new THREE.Vector3(1, 0, 0));
  
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
      const lineVal = new THREE.Line(geometry, material);
      })
  }

  function fillStarsBackground () {
    const maxStars = 10000
    const stars = []
    const backgroundSize = 4.4
    const divideBackground = 10
    const cellSize = backgroundSize / divideBackground

    for (let x = 0; x < divideBackground; x++) {
      for (let y = 0; y < divideBackground; y++) {
        
      }
    }

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


  function prepLines() {
    const lines = []

    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    const points = [];
    points.push(new THREE.Vector3(- 1, 0, 0));
    points.push(new THREE.Vector3(0, 1, 0));
    points.push(new THREE.Vector3(1, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line)

    return lines
  }

  function prepBirds() {
    const meshArray = []
    for (let i = 0; i < countBoxes; i++) {
      const subSize = [];
      const subPos = [];

      const randomSide = round(pSin(i * 56678) * 2)

      for (let d = 0; d < 3; d++) {
        const sizeD = randInRange(mnbs[d], mxbs[d], pSin(10*i * randRatio[d]));
        subSize.push(sizeD)

        // it is a little messed up, maybe there is some easier way to do it
        let pd = sin(randRatio[d] * i) * dbs[d] / 2;
        if (i == randomSide && abs(pd) < zs[d] / 2) {
          pd = zs[d] / 2 * sign(pd);
        }
        subPos.push(pd);
      }


      //const geometry = new THREE.BoxGeometry( subSize[0], subSize[0], subSize[0]*2 );
      const geometry = new THREE.ShapeGeometry(birdShape);

      // let clr = {
      //   r: 0.8 + pSin(i * 130) * 0.2,
      //   g: 0.5 + pSin(i * 150) * 0.3,
      //   b: 0.3 + pSin(i * 180) * 0.5
      // }

      const pelleteColor = pallete[(i % pallete.length - 1) + 1]
      //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      // const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(clr.r, clr.g, clr.b) });
      
      const material = new THREE.MeshLambertMaterial({ color: pelleteColor });
      //const material = new THREE.MeshStandardMaterial({ map: texture, });
      const shape = new THREE.Mesh(geometry, material);

      shape.position.set(subPos[0], subPos[1], subPos[2]);

      shape.scale.x = subSize[0]
      shape.scale.y = subSize[0]
      shape.scale.z = subSize[0]

      shape.up = new THREE.Vector3(0, 0, 1)

      scene.add(shape)
      meshArray.push(shape)

    }

    //cubeGroup.rotation.x = 1;
    return meshArray
  }

  const light = new THREE.DirectionalLight(0xff0000, 1);
  light.position.set(2, 2, 2);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0);
  // scene.add(ambientLight);

  // const backColor = new THREE.Color().setRGB(0.01, 0.01, 0.01);
  // const backColor = new THREE.Color("#2d196e");
  // const backColor = new THREE.Color("#120b2c");
  const backColor = new THREE.Color("rgba(20, 20, 20, 1)");
  // const backColor = new THREE.Color(pallete[0]);
  console.log("backColor", backColor)
  scene.background = backColor
  let t = 0;
  let pos = {
    x: 0,
    y: 0,
    z: 0
  }
  let poss = []
  for (let j = 0; j < countBoxes; j++) {
    poss.push({
      x: 0,
      y: 0,
      z: 0
    })
  }

  var test = 0;
  function moveShapes(meshArray) {
    t += 0.0001;
    const totalShapes = meshArray.length;
    for (let i = 0; i < totalShapes; i++) {
      const shapeChild = meshArray[i];
      let shPos = shapeChild.position
      const shSize = shapeChild.geometry.parameters
      const shHeight = +shSize.height
      const shScaleX = shapeChild.scale.x
      let k = i - totalShapes / 2
      if (k < 0) {
        k -= 1
      } else {
        k += 1
      }
      /*
      //cubeChild.rotation.x += 0.1*(i+1)/totalCubes;
      //cubeChild.rotation.y += 0.1*(i+1)/totalCubes;
      
      poss[i].x = sin(t*300+i)*2*k;
      poss[i].y = cos(t*300+i)*2*k;
      let addX = ((poss[i].x - shPos.x)/(20*(i+shScaleX)+1000*shScaleX))
      let addY = ((poss[i].y - shPos.y)/(20*(i+shScaleX)+1000*shScaleX))
      const newVectorPos = new THREE.Vector3(shapeChild.position.x + addX, shapeChild.position.y + addY,poss[i].z)
      
      const previousZAngle = shapeChild.rotation.z
      
      shapeChild.lookAt(newVectorPos)
      shapeChild.rotation.x = 0
      shapeChild.rotation.y = 0
      //shapeChild.rotation.z = 0
      //shapeChild.rotation.z += -PI/2
      
      const zAngle = shapeChild.rotation.z
      //const newZAngle 
      
      //cubeChild.position.x += 0;
      //cubeChild.position.y += 0;
      //console.log((shScaleX))
      */

      const sizeDependingCoef = shScaleX * 4;

      const zAngle = (t * 500 + i / 10) * shScaleX

      shapeChild.rotation.z = -zAngle
      shapeChild.position.x -= sin(zAngle) / 100
      shapeChild.position.y -= cos(zAngle) / 100
    }
  }
  let x = 0, y = 0, z = 0;

  const doLines = (lines) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const positionAttribute = line.geometry.getAttribute('position');



      for (let i = 0; i < positionAttribute.count; i++) {
        let px = positionAttribute.getX(i)
        let py = positionAttribute.getY(i)
        // let pz = positionAttribute.getZ(i)

        px += (Math.random() - 0.5) / 3;
        py += (Math.random() - 0.5) / 3;
        // pz += (Math.random() - 0.5) / 3;


        positionAttribute.setX(i, px)
        positionAttribute.setY(i, py)


      }
      positionAttribute.needsUpdate = true;
    }
  }
  
  const visualizeSkeleton = () => {
    const helper = new THREE.SkeletonHelper(root);
    scene.add(helper);
    scene.add(root);
  }

  function curls(offsetVal, scaleVal) {
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

  function drawHand(position, options) {
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

  function linesPatterns(pointsArray, options) {
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

      drawLine(points, {color, lineWidth, dashSize, gapSize})
    }

  }

  function basicCloth(pointsArray, options) {
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

  function drawLine(points, options) {
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

  function psin(x) {
    return (sin(x) + 1) / 2
  }

  function brokenPattern1(pointsArray, options) {
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
        drawLine([previousPosWithOffset, nextPosWithOffset], {lineWidth, color});
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

  function pattern1(pointsArray, options) {
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
        drawLine([previousPosWithOffset, nextPosWithOffset], {lineWidth: i == 0 ? 5 : lineWidth, color: i === 0 ? 0x00ff00 : color});
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

  function face1(position) {
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

  // visualizeSkeleton()
  applyPose(tPoseData, skeleton)
  // rotatePose(relaxedSittingPhoneAnglesData, new THREE.Euler(0,0,0))
  applyPose(sittingLegsClose, skeleton)
  // skeleton.bones[0].rotation.y = PI / 3 + PI;

  const headPosition = new THREE.Vector3()
  skeleton.getBoneByName("head").getWorldPosition(headPosition)


  const leftElbowPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftElbow").getWorldPosition(leftElbowPosition)
  const leftHandPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftHand").getWorldPosition(leftHandPosition)
  const copyLeftHandPosition = leftHandPosition.clone()
  const leftHandRotation = skeleton.getBoneByName("leftHand").rotation
  console.log("leftHandRotation", leftHandRotation)

  const rightElbowPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightElbow").getWorldPosition(rightElbowPosition)
  const rightHandPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightHand").getWorldPosition(rightHandPosition)
  const copyRightHandPosition = rightHandPosition.clone()
  const rightHandRotation = skeleton.getBoneByName("rightHand").rotation

  const leftShoulderPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftShoulder").getWorldPosition(leftShoulderPosition)
  const rightShoulderPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightShoulder").getWorldPosition(rightShoulderPosition)

  const upperTorsoPosition = new THREE.Vector3()
  skeleton.getBoneByName("upperTorso").getWorldPosition(upperTorsoPosition)
  const lowerTorsoPosition = new THREE.Vector3()
  skeleton.getBoneByName("lowerTorso").getWorldPosition(lowerTorsoPosition)

  const leftLegPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftLeg").getWorldPosition(leftLegPosition)
  const rightLegPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightLeg").getWorldPosition(rightLegPosition)

  const leftKneePosition = new THREE.Vector3()
  skeleton.getBoneByName("leftKnee").getWorldPosition(leftKneePosition)
  const rightKneePosition = new THREE.Vector3()
  skeleton.getBoneByName("rightKnee").getWorldPosition(rightKneePosition)
  const leftFootPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftFoot").getWorldPosition(leftFootPosition)
  const rightFootPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightFoot").getWorldPosition(rightFootPosition)

  const rootPosition = new THREE.Vector3()
  skeleton.getBoneByName("root").getWorldPosition(rootPosition)

  const torsoWidth = 0.3;
  const leftUpperTorsoPosition = new THREE.Vector3(upperTorsoPosition.x + torsoWidth / 2, upperTorsoPosition.y, upperTorsoPosition.z);
  const rightUpperTorsoPosition = new THREE.Vector3(upperTorsoPosition.x - torsoWidth / 2, upperTorsoPosition.y, upperTorsoPosition.z);
  

  const rightShouldRectangle = getRectangleCorners(rightShoulderPosition, rightElbowPosition, 0.1);
  const rightHandReactangle = getRectangleCorners(rightHandPosition, rightElbowPosition, 0.1);

  const leftShouldRectangle = getRectangleCorners(leftShoulderPosition, leftElbowPosition, 0.1);
  const leftHandReactangle = getRectangleCorners(leftHandPosition, leftElbowPosition, 0.1);

  const rightLegRectangle = getRectangleCorners(rightLegPosition, rightKneePosition, 0.1);
  const rightFootReactangle = getRectangleCorners(rightFootPosition, rightKneePosition, 0.1);

  const leftLegRectangle = getRectangleCorners(leftLegPosition, leftKneePosition, 0.1);
  const leftFootReactangle = getRectangleCorners(leftFootPosition, leftKneePosition, 0.1);
  
  const upperTorsoShape = [rootPosition, leftShoulderPosition, leftUpperTorsoPosition, rightUpperTorsoPosition, rightShoulderPosition]
  const lowerTorsoShape = [leftUpperTorsoPosition, leftLegPosition, rightLegPosition, rightUpperTorsoPosition]

  fillStarsBackground()

  curls(headPosition.clone().add(new THREE.Vector3(0, 0.2, 0.6)) , 1.3)
  face1(headPosition.clone().add(new THREE.Vector3(-0.1, 0.25, 0.5)))


  // crazyCloth1(upperTorsoShape, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(lowerTorsoShape, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(rightShouldRectangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(leftShouldRectangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(rightHandReactangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(leftHandReactangle, {offset: new THREE.Vector3(0, 0, 1)})

  linesPatterns([leftShoulderPosition, rootPosition, rightShoulderPosition], {rotation: -PI/3, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(leftShouldRectangle, {rotation: -PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(leftHandReactangle, {rotation: PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 1)})
  linesPatterns(leftShouldRectangle, {rotation: -PI/3, amountOfLines: 40, offset: new THREE.Vector3(0, 0, -0.3)})

  linesPatterns(rightShouldRectangle, {rotation: PI/1.6, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(rightHandReactangle, {rotation: PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 1)})

  linesPatterns(leftLegRectangle, {rotation: PI/2.5, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(leftFootReactangle, {rotation: PI/1.5, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(rightLegRectangle, {rotation: PI * 1.1, lineLength: 0.7, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(rightFootReactangle, {rotation: -PI/4, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})

  basicCloth(upperTorsoShape, {color: 0x333f33})
  basicCloth(lowerTorsoShape, {color: 0x333f33})
  basicCloth(rightShouldRectangle, {color: 0x333f33})
  basicCloth(leftShouldRectangle, {color: 0x333f33})
  basicCloth(rightHandReactangle, {color: 0x333f33})
  basicCloth(leftHandReactangle, {color: 0x333f33})
  basicCloth(rightLegRectangle, {color: 0xdfc300})
  basicCloth(rightFootReactangle, {color: 0xf3e333})
  basicCloth(leftLegRectangle, {color: 0xf3e333})
  basicCloth(leftFootReactangle, {color: 0xdfc300})
  // basicCloth([...leftLegRectangle, ...leftFootReactangle], {color: 0xf3f333})

  // coat1(upperTorsoShape, {scale: 10, amountOfRects: 100, radius: 0.1, radius2: 0.05, opacity: 0.5, offset: new THREE.Vector3(0, 0, 1)})
  // coat1(upperTorsoPosition, lowerTorsoPosition, {scale: 5, amountOfRects: 10})
  // coat1(leftShoulderPosition, leftElbowPosition, {scale: 2})
  // coat1(rightShoulderPosition, rightElbowPosition, {scale: 2})
  // coat1(rightElbowPosition, rightHandPosition, {scale: 2})
  // coat1(leftElbowPosition, leftHandPosition, {scale: 2})

  brokenPattern1(upperTorsoShape, {initPoint: rootPosition, initAngle: getAngleXYfrom3D(rootPosition, upperTorsoPosition) + PI / 2})
  brokenPattern1(lowerTorsoShape, {initPoint: lowerTorsoPosition, initAngle: getAngleXYfrom3D(lowerTorsoPosition , rootPosition) + PI / 2})
  brokenPattern1(rightShouldRectangle, {initPoint: rightShoulderPosition, initAngle: getAngleXYfrom3D(rightShoulderPosition, rightElbowPosition)})
  brokenPattern1(leftShouldRectangle, {initPoint: leftElbowPosition, initAngle: getAngleXYfrom3D(leftElbowPosition, leftShoulderPosition)})
  brokenPattern1(rightHandReactangle, {initPoint: rightHandPosition, initAngle: getAngleXYfrom3D(rightHandPosition,rightElbowPosition)})
  brokenPattern1(leftHandReactangle, {initPoint: leftHandPosition, initAngle: getAngleXYfrom3D(leftHandPosition,leftElbowPosition)})
  brokenPattern1(rightLegRectangle, {initPoint: rightKneePosition, initAngle: getAngleXYfrom3D(rightKneePosition,rightLegPosition)})
  brokenPattern1(rightFootReactangle, {initPoint: rightFootPosition, initAngle: getAngleXYfrom3D(rightFootPosition,rightKneePosition)})
  brokenPattern1(leftLegRectangle, {initPoint: leftKneePosition, initAngle: getAngleXYfrom3D(leftKneePosition, leftLegPosition) + PI / 2})
  brokenPattern1(leftFootReactangle, {initPoint: leftFootPosition, initAngle: getAngleXYfrom3D(leftFootPosition,leftKneePosition) + PI / 2})

  drawHand(copyRightHandPosition, {color: "#F9DEC9", rotation: rightHandRotation, handSize: new THREE.Vector3(0.1, 0.2, 0.01), offset: new THREE.Vector3(0.05, -0.1, 0)});
  drawHand(copyLeftHandPosition, {color: "#F9DEC9", rotation: leftHandRotation, handSize: new THREE.Vector3(0.1, 0.2, 0.01), offset: new THREE.Vector3(0.1, -0.05, 0)});

  // const meshArray = prepBirds()
  // const linesArray = prepLines()

  // console.log(linesArray)

  function animate() {
    requestAnimationFrame(animate);

    // moveShapes(meshArray)
    // doLines(linesArray)
    // skeleton.bones[0].rotation.y += -Math.PI / 100;

    renderer.render(scene, camera);
  }

  animate();
  // renderer.render( scene, camera );
}

main()
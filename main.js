import * as THREE from 'three';

import { Vector3 } from 'three';
import { randInRange, pSin, pCos, distance3D, loadTextureF } from "./utils.js"
import { heartShape, birdShape } from "./shapes.js"
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import {applyPose, tPoseData, casualPoseData, sittingPoseData, sittingPhonePoseData, leapPoseData, relaxedSittingPhoneData, relaxedSittingPhoneAnglesData, rotatePose} from "./poses.js"
//import wall from './assets/textures/wall.jpg';

const {sin, cos, PI, random, pow} = Math;


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
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 2);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const backColor = new THREE.Color().setRGB(0.01, 0.01, 0.01);
  // const backColor = new THREE.Color(pallete[0]);
  console.log("backColor", backColor)
  scene.background = backColor

  camera.position.z = 10;
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
            currentPos.copy(nextPos); // Move the "cursor" to the new point
        }

        // Create Geometry and Material for the line
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const randomColorIndex = Math.floor(Math.random() * hairPallete.length);
        const material = 
        new THREE.LineBasicMaterial({
        // new LineMaterial({
          color: hairPallete[randomColorIndex],
					linewidth: 5, // in world units with size attenuation, pixels otherwise
					// vertexColors: true,

					// dashed: false,
					alphaToCoverage: true,
        });

        const line = new THREE.Line(geometry, material);
        group.add(line);
    }

    scene.add(group);
  }

  function simpleCoat(pointsArray, options) {
    const scale = options?.scale || 1
    // const start = startVal.clone() || new THREE.Vector3(0,0,0)
    // const end = endVal.clone() || new THREE.Vector3(0,0,0)
    const radius = options?.radius || 0;
    const radius2 = options?.radius2 || radius;
    const color = options?.color || 0x000000
  

    const coatShape = new THREE.Shape();
    coatShape.moveTo( pointsArray[0].x, pointsArray[0].y );
    pointsArray.forEach(point => {
      coatShape.lineTo( point.x, point.y );
    })
    coatShape.lineTo( pointsArray[0].x, pointsArray[0].y );
    const extrudeSettings = {
      steps: 2,
      depth: radius,
      bevelEnabled: false,
    };
    const extrudeGeometry = new THREE.ExtrudeGeometry(coatShape, extrudeSettings);
    const extrudeMaterial = new THREE.MeshBasicMaterial({ color });
    const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
    extrudeMesh.position.set(0, 0, 0);
    extrudeMesh.rotation.set(0, 0, 0);
    extrudeMesh.scale.set(scale, scale, scale);
    scene.add(extrudeMesh);
  
  }
  
  function coat1(pointsArray, options) {
    const shapesArray = []
    const scale = options?.scale || 1
    // const start = startVal.clone() || new THREE.Vector3(0,0,0)
    // const end = endVal.clone() || new THREE.Vector3(0,0,0)
    const amountOfRects = options?.amountOfRects || 300;
    const radius = options?.radius || 0;
    const radius2 = options?.radius2 || radius;

    var colorRange = 0.5;
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
        opacity: 0.1,
        transparent: true
      });
      //const material = new THREE.MeshStandardMaterial({ map: texture, });
      const currentPos = getRandomPointBetweenPoints(pointsArray)
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

  visualizeSkeleton()
  applyPose(tPoseData, skeleton)
  // rotatePose(relaxedSittingPhoneAnglesData, new THREE.Euler(0,0,0))
  applyPose(relaxedSittingPhoneAnglesData, skeleton)
  skeleton.bones[0].rotation.y = -PI / 8 + PI;

  const headPosition = new THREE.Vector3()
  skeleton.getBoneByName("head").getWorldPosition(headPosition)

  curls(headPosition.add(new THREE.Vector3(0, 0.2, 0)) , 1.5)

  const leftElbowPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftElbow").getWorldPosition(leftElbowPosition)
  const leftHandPosition = new THREE.Vector3()
  skeleton.getBoneByName("leftHand").getWorldPosition(leftHandPosition)

  const rightElbowPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightElbow").getWorldPosition(rightElbowPosition)
  const rightHandPosition = new THREE.Vector3()
  skeleton.getBoneByName("rightHand").getWorldPosition(rightHandPosition)

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

  const rootPosition = new THREE.Vector3()
  skeleton.getBoneByName("root").getWorldPosition(rootPosition)

  const torsoWidth = 0.3;
  const leftUpperTorsoPosition = new THREE.Vector3(upperTorsoPosition.x - torsoWidth / 2, upperTorsoPosition.y, upperTorsoPosition.z);
  const rightUpperTorsoPosition = new THREE.Vector3(upperTorsoPosition.x + torsoWidth / 2, upperTorsoPosition.y, upperTorsoPosition.z);

  simpleCoat([rootPosition, leftShoulderPosition, leftUpperTorsoPosition, rightUpperTorsoPosition, rightShoulderPosition], {scale: 1, color: 0x333333, radius: 0.5, radius2: 0.1})
  simpleCoat([leftUpperTorsoPosition, leftLegPosition, rightLegPosition, rightUpperTorsoPosition], {scale: 1, color: 0x333333, radius: 0.5, radius2: 0.1})
  coat1([rootPosition, upperTorsoPosition, lowerTorsoPosition, leftShoulderPosition, rightShoulderPosition], {scale: 10, amountOfRects: 1000, radius: 0.5, radius2: 0.1})
  // coat1(upperTorsoPosition, lowerTorsoPosition, {scale: 5, amountOfRects: 10})
  // coat1(leftShoulderPosition, leftElbowPosition, {scale: 2})
  // coat1(rightShoulderPosition, rightElbowPosition, {scale: 2})
  // coat1(rightElbowPosition, rightHandPosition, {scale: 2})
  // coat1(leftElbowPosition, leftHandPosition, {scale: 2})


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
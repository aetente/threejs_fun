import * as THREE from 'three';

import { Vector2, Vector3, MathUtils } from 'three';
import { randInRange, pSin, pCos, distance3D, loadTextureF, seededRandomRange } from "./utils.js"
import { heartShape, birdShape } from "./shapes.js"
import { lisa, dancePerson1, dancePerson2, basicPerson, pattern1Person } from './people.js';
//import wall from './assets/textures/wall.jpg';
import {
  testPose1,
  testPose2,
  testPose3,
  testPose4,
  testPose5,
  walk1,
  generateRandomPose
} from './poses.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import {
  dbs,
  zs,
  countBoxes,
  mnbs,
  mxbs,
  randRatio,
  totalWidth,
  totalHeight,
  pallete,
  flowersPalette1,
  flowersPalette2
}
from "./consts.js"

import {pattern1, swarm1} from "./patterns.js"

import {saveImage, drawLine, updateLineGeometryPositions} from "./utils.js"
const {seededRandom, lerp, smoothstep} = MathUtils

const {sin, cos, PI, random, pow, floor, acos, atan2} = Math;

const main = async () => {

  let currentFrame = 0;
  const format = 'image/png';
  const saveFrames = false
  const reconstruct = false
  const precheck = false
  const startFrame = 100
  let currentFrameName = startFrame;
  const framesToSave = 60 * 24; // 60 frames generate 2 seconds, so times 15 it will be 30 seconds
  const skipFrames = 1
  
  const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const camera = new THREE.PerspectiveCamera(35, totalWidth / totalHeight, 0.1, 1000);

  camera.position.z = 40;
  camera.position.x = 0

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true // Required for capturing the image
  });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(totalWidth,totalHeight)
  document.body.appendChild(renderer.domElement);



  const texture = await loadTextureF(
    '/assets/textures/wall.jpg'
  );
  //texture.colorSpace = THREE.SRGBColorSpace;
  const fl1 = await loadTextureF('/assets/flowers/fl1.png')
  //fl1.colorSpace = THREE.SRGBColorSpace;
  const fl2 = await loadTextureF('/assets/flowers/fl2.png')
  //fl2.colorSpace = THREE.SRGBColorSpace;
  const pigeonTexture1 = await loadTextureF('/assets/textures/pigeon/Pigeon1Saturated.png')
  const pigeonTexture2 = await loadTextureF('/assets/textures/pigeon/Pigeon2Saturated.png')
  // pigeonTexture1.colorSpace = THREE.SRGBColorSpace;
  // pigeonTexture2.colorSpace = THREE.SRGBColorSpace;
  
  const pigeonSprite1 = await loadTextureF('/assets/textures/pigeon/pigeon1_sprite.png')
  pigeonSprite1.repeat.set(1/2,1/1)

  const photo_test1 = await loadTextureF('/assets/photos/20260804_224901-01.jpeg')
  // const photo_test2 = await loadTextureF('/assets/photos/20250218_182704-02_foreground.png')

  const doPhotoLayer  = (scene) => {
    photo_test1.repeat.set( 1, 1 );
    photo_test1.wrapS = THREE.RepeatWrapping;
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(2.082*13, 3.377*13),
      new THREE.MeshBasicMaterial({ map: photo_test1 })
    );
    photo.position.set(0, -0.5, -1);
    scene.add(photo);

    // photo_test2.repeat.set( 1, 1 );
    // const photo2 = new THREE.Mesh(
    //   new THREE.PlaneGeometry(15, 20),
    //   new THREE.MeshBasicMaterial({ map: photo_test2, transparent: true })
    // );
    // photo2.position.set(0, 0, 0);
    // scene.add(photo2);

    // const block1 = new THREE.Mesh(
    //   new THREE.PlaneGeometry(15, 20),
    //   new THREE.MeshBasicMaterial({ color: "#000c1b" })
    // );
    // block1.position.set(0, -20,0 0);
    // scene.add(block1);
  }
  
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

  const light = new THREE.DirectionalLight(0xff0000, 1);
  light.position.set(2, 2, 2);
  //scene.add(light);
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
   scene.add(ambientLight);

  // const backColor = new THREE.Color().setRGB(0.01, 0.01, 0.01);
  // const backColor = new THREE.Color("#2d196e");
  // const backColor = new THREE.Color("#120b2c");
  //const backColor = new THREE.Color("rgba(20, 20, 20, 1)");
  // const backColor = new THREE.Color("#F63049")
  // const backColor = new THREE.Color("#3c5601")
  // const backColor = new THREE.Color("#ccc")
  // const backColor = new THREE.Color(pallete[0]);
  // const backColor = new THREE.Color("#E2725B")
  // const backColor = new THREE.Color("#0B4F6C")
  // const backColor = new THREE.Color("#D18B47")
  // const backColor = new THREE.Color("#00B4D8")
  // const backColor = new THREE.Color("#44ff99")
  //const backColor = new THREE.Color("#0F141C")
  //const backColor = new THREE.Color("#3300FF")
  //const backColor = new THREE.Color("#FF44AA")
  //const backColor = new THREE.Color("#F4F1EA")
  //const backColor = new THREE.Color("#FDF8F5")
  // const backColor = new THREE.Color("#E2ECC8")
  // const backColor = new THREE.Color("#FFF338")
  // const backColor = new THREE.Color("#C77DFF")
  // const backColor = new THREE.Color("#FF9F43")
  //const backColor = new THREE.Color("#E5A93B")
  //const backColor = new THREE.Color("#01000f")
  // const backColor = new THREE.Color("#1C2321")
  //const backColor = new THREE.Color("#cd5f0e")
  // const backColor = new THREE.Color("#EDF1D6")
  // const backColor = new THREE.Color("#8B1E2D")
  // const backColor = new THREE.Color("#1A1423")
  // const backColor = new THREE.Color("#C84630")
  
  const backColor = new THREE.Color("#F7E3AF")
  
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


  const generateAvoidPoints = (seedAdd) => {
    const avoidPoints = []
    const amountOfPoints = 3
    for (let i = 0; i < amountOfPoints; i++) {
      const avoidPoint = {
        point: new Vector3(
          6*sin(seedAdd),
          6*cos(seedAdd),
          // randInRange(-6,6,seededRandom(i*234727) + seedAdd),
          // randInRange(-6,6,seededRandom(i*12314) + seedAdd),
          0),
        weight: 5.5
      }
      avoidPoints.push(avoidPoint)
    }
    return avoidPoints
  }

  const doText = async () => {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync('/assets/fonts/helvetiker_regular.typeface.json');
    
    const textGeometry = new TextGeometry('Hello three.js!', {
      font: font,
      size: 5,         // Reduced size
      height: 1,       // Reduced height
      curveSegments: 12,
      bevelEnabled: false // Turn off bevel for now to simplify
    });

    textGeometry.center(); // Center the text on its own axis

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, material);

    // Position it far enough away to see it
    textMesh.position.z = -10; 
    scene.add(textMesh);

    console.log("textMesh", textMesh)
  }

  function drawCircle(pos, color, radius) {
    const circleGeometry = new THREE.CircleGeometry(radius, 16);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: color });
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.position.set(pos.x, pos.y, pos.z);
    scene.add(circleMesh);
  }
  
  let at = 0
  let bt = 0
  let dt = saveFrames ? 0.3 : 0.3
  
  const drawnPoints = []
  let point
  
  const testGround = async () => {
    const maxP = 10
    let prevPoints = []
    const nextat = at + dt/4
    const gt = at*3
    const ft =  (gt + sin(gt))
    const ft2 =  (gt + sin(gt-PI/2))
    for(let i = 0; i < maxP; i++) {
      
    const ni = (i/maxP) + 1
    const nextni = (((i+1)%maxP)/maxP) + 1
    
    const avoidPoints = generateAvoidPoints(i + at)
    const scaleRect = new Vector2(1,0)
    const testPoints = [
      new Vector3(0,0,0),
      new Vector3(0,scaleRect.y,0),
      new Vector3(scaleRect.x, scaleRect.y,0),
      new Vector3(scaleRect.x,0,0)
    ]
    const middlePoint = testPoints.reduce((a,c) => a.add(c),new Vector3(0,0,0))
    testPoints.forEach(p => {
      p.x -= scaleRect.x/2;
      p.y -= scaleRect.y/2;
    })
    const si = 1
    const testPointsOffset =
      new Vector3(
        // si*sin(ni*PI*2),-6,
        6*sin(ni*PI + at*5) + 0*sin(at*5),
        12*cos(ni*PI*3.1 + at*5) + 0*cos(at*5),
        // si*cos(ni*PI*2)-10,
        0
      )
    const nextTestPointsOffset =
      new Vector3(
        // si*sin(ni*PI*2),-6,
        6*sin(nextni*PI + nextat*5) + 0*sin(nextat*5),
        12*cos(nextni*PI*3.1 + nextat*5) + 0*cos(nextat*5),
        // si*cos(ni*PI*2)-10,
        0
    )
    // drawCircle(testPointsOffset, 0xff0000, 0.1)
    testPoints.forEach(p => {
      p.x += testPointsOffset.x;
      p.y += testPointsOffset.y;
      p.z += testPointsOffset.z
    })
    //await doText()
    const tailDist = 14 * pSin(ft + PI/3) + 4
    const rx = testPointsOffset.x + 2*sin(ni*PI*2 + gt*3)
    //0*sin(at + sin(at) + ni*2*PI)
    const ry = testPointsOffset.y + 2*cos(ni*PI*2 + gt*3)
    //0*cos(5*at + ni / 2)
    const refPoint = nextTestPointsOffset
    //  new Vector3(0 + rx,0 + ry,0)
    const theAngle = 
      refPoint.angleTo(testPointsOffset)
      //-PI/2
      //2.0671854475079234
    // drawCircle(refPoint, 0x00ff00, 0.1)
    if (false && i == 100) {
      swarm1(scene, {
        t: at,
        textures: [pigeonTexture1, pigeonTexture2],
        pointToFollow: refPoint,
        amountOfElements:10
      })
    }
    const branchPoint = prevPoints[floor(i/maxP*prevPoints.length/2)]
    const branchPoints = [branchPoint,branchPoint,branchPoint,branchPoint]
    const startPoints = true || i == 0 ? testPoints : branchPoints.positions
    let savePrevPoints
    if (true || i == 0 || prevPoints.length > 0) {
    savePrevPoints = pattern1(scene, startPoints, {
      scale:8 +4*sin(i + at),
      dotScale: 8,
      t: at + i/10,
      maxLines: 160,
      limit: 1,
      initAngle: -PI/2,
      lineColor: "#FF6B35",
      // colorArray: ["#9DC08B", "#609966", "#40513B"],
      colorArray: ["#43637E", "#65DCD5", "#D9FFF4"],
      dotColor: "#ff0000",
      dotTextures: [fl1,fl2],
      //refPoint: middlePoint, 
      refPoint: refPoint,
      noDrawing: drawnPoints.length >= maxP,
      //desiredAngle: theAngle,
      avoidPoints: avoidPoints,
      /*[
        {
          point: new Vector3(0,0,0),
          weight: 5
        },
        {
          point: new Vector3(-1, 1, 0),
          weight: 0
        }
      ],*/
      angleToRef: true
    })
    if (drawnPoints.length < maxP) {
      drawnPoints.push(savePrevPoints)
    } else {
      updateDrawnPoints(drawnPoints[i],savePrevPoints)
    }
    }
    if (i == 0) {
      prevPoints = savePrevPoints
    }
    }
  }
  
  const updateDrawnPoints = (drawnPointsVal,savePrevPoints) => {
    
    for (let j = 0; j < drawnPointsVal.mesh.length; j++) {
      // console.log(savePrevPoints.positions[j])
      drawnPointsVal.mesh[j].geometry = updateLineGeometryPositions(drawnPointsVal.mesh[j].geometry, savePrevPoints.positions[j])
    }
  }

  const amountOfRobotArms = 5
  const generateRebotArm = () => {
    const robotArmsArray = []
    for (let i = 0; i < amountOfRobotArms; i++) {
      const robotArm = {
        position1: new Vector3(-3,0,1),
        position2: new Vector3(0,0,0),
        rotation1: 0,
        rotation2: 0,
        width1: 0.3,
        width2: 0.1,
        nearDrawPoint: null,
        progress: 0,
        upcomingLineSegment: -1,
        currentLineSegment: -1,
        currentIndex: -1,
        base: null,
        meshArm1: null,
        meshArm2: null,
        circle: null,
        line1Geometry: null,
        line2Geometry: null,
        color: "#0C6291"
      }
      robotArmsArray.push(robotArm)
    }
    return robotArmsArray
  }
  var robotArms = generateRebotArm()
  const middleArm = {
    armsPositions: [],
    armsLines: Array(amountOfRobotArms).fill(null),
    base: null,
    width: 8,
    middlePoint: robotArms.reduce((a,c) => a.add(c.position1), new Vector3(0,0,0)).divideScalar(amountOfRobotArms),
  }

  const dumbStoreIndexes = {}

  var globalImage = [];
  const pictureFactory1 = () => {
    const scaleVal = 4
    for (let i = 0; i < amountOfRobotArms; i++) {
      drawRobotArm(scene, {i:i})
    }
    drawMiddlePointBase(scene)
    if (globalImage.length == 0) {
      const maxP = 200
      let prevPoints = []
      for(let i = 0; i < maxP; i++) {
        // dumbStoreIndexes[String(i)] = true
        
        const ni = (i/maxP) + 1
        
        const avoidPoints = generateAvoidPoints(i*25357)
        const scaleRect = new Vector2(3,3)
        const testPoints = [
          new Vector3(0,0,0),
          new Vector3(0,scaleRect.y,0),
          new Vector3(scaleRect.x, scaleRect.y,0),
          new Vector3(scaleRect.x,0,0)
        ]
        const middlePoint = testPoints.reduce((a,c) => a.add(c),new Vector3(0,0,0))
        testPoints.forEach(p => {
          p.x -= scaleRect.x/2;
          p.y -= scaleRect.y/2;
        })
        const si =14
        const testPointsOffset =
          new Vector3(
            //si*sin(123 + i*23542),-4,
            si*sin(ni*PI*2),
            si*cos(ni*PI*2),
            0
          )
        testPoints.forEach(p => {
          p.x += testPointsOffset.x;
          p.y += testPointsOffset.y;
          p.z += testPointsOffset.z
        })
        const rx = 0
        //6
        //+4*sin(63546+i*125)
        //+4*sin(ni*PI*2)
        const ry = 0
        //8
        //+4*cos(23423+i*765)
        +4*cos(ni*PI*2)
        const refPoint = new Vector3(0 + rx,0 + ry,0)
        const theAngle = 
          refPoint.angleTo(testPointsOffset)
        const branchPoint = prevPoints[floor(i/maxP*prevPoints.length/2)]
        const branchPoints = [branchPoint,branchPoint,branchPoint,branchPoint]
        const startPoints = i == 0 || true ? testPoints : branchPoints
        let savePrevPoints
        if (i == 0 || prevPoints.length > 0) {
          savePrevPoints = pattern1(scene, startPoints, {
            scale:scaleVal,
            dotScale: 8,
            t: i/10,
            maxLines: 160,
            limit: 1,
            initAngle: PI/2,
            lineColor: "#000",
            colorArray: ["#0C6291", "#F15156", "#FFC07F", "#FFCF99"],
            dotColor: "#ff0000",
            dotTextures: [fl1,fl2],
            refPoint: refPoint,
            noDrawing: !precheck,
            angleToRef: true,
            avoidPoints: avoidPoints
          })
        }
        if (i == 0) {
          prevPoints = savePrevPoints.positions
        }
        globalImage.push(savePrevPoints.positions)
      }
    }
    if (!precheck || true) {
    drawLinesImage(globalImage, {
      lineWidth: 2,
      color: "#000",
      colorArray: ["#0C6291", "#F15156", "#FFC07F", "#FFCF99"],
      lineOpacity: 1,
      offset: new Vector3(0,0,0),
      t: at,
      scale: scaleVal
    })
    }
  }


  const drawMiddlePointBase = (scene) => {
    if (!middleArm.base) {
      const middlePoint = middleArm.middlePoint
      const middleBaseCircle = new THREE.CircleGeometry(0.45, 16);
      const middleBaseMaterial = new THREE.MeshBasicMaterial({ color:"#0C6291"});
      const middleBaseShape = new THREE.Mesh(middleBaseCircle, middleBaseMaterial);
      middleBaseShape.position.set(middlePoint.x, middlePoint.y, middlePoint.z+1);
      scene.add(middleBaseShape);
      middleArm.base = middleBaseShape
    } else {
      middleArm.base.position.set(middleArm.middlePoint.x, middleArm.middlePoint.y, middleArm.middlePoint.z+1);
    }
  }

  const drawRobotArm = (scene, options) => {

    // scene.add(shape2);
    const i = options.i || 0
    const robotArmLength1 = options.robotArmLength1 || 3
    const robotArmLength2 = options.robotArmLength2 || 3
    
    if (!robotArms[i].meshArm1 || !middleArm.armsLines[i]) {
      const planeArm1 = new THREE.PlaneGeometry(robotArmLength1, robotArms[i].width1)
      const planeArm2 = new THREE.PlaneGeometry(robotArmLength2, robotArms[i].width2)

      planeArm1.translate(robotArmLength1/2, 0,0);
      planeArm2.translate(robotArmLength2/2, 0, 0);

      const materialArm1 = new THREE.MeshBasicMaterial({ color: robotArms[i].color });
      const materialArm2 = new THREE.MeshBasicMaterial({ color: robotArms[i].color });
      const meshArm1 = new THREE.Mesh(planeArm1, materialArm1);
      const meshArm2 = new THREE.Mesh(planeArm2, materialArm2);
      // const armAnchor1 = new THREE.Group();
      // const armAnchor2 = new THREE.Group();
      meshArm1.position.set(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z);
      meshArm1.rotation.z = robotArms[i].rotation1
      scene.add(meshArm1);
      
      meshArm2.position.set(robotArms[i].position2.x, robotArms[i].position2.y, robotArms[i].position2.z);
      meshArm2.rotation.z = robotArms[i].rotation2
      meshArm1.add(meshArm2);

      
      const circle = new THREE.CircleGeometry(0.3, 16);
      const material = new THREE.MeshBasicMaterial({ color:robotArms[i].color});
      const shape = new THREE.Mesh(circle, material);
      shape.position.set(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z);
      scene.add(shape);

      
      const circle2 = new THREE.CircleGeometry(0.3, 16);
      const material2 = new THREE.MeshBasicMaterial({ color:robotArms[i].color});
      const shape2 = new THREE.Mesh(circle2, material2);
      shape2.position.set(robotArms[i].position2.x, robotArms[i].position2.y, robotArms[i].position2.z);
      meshArm1.add(shape2);
      
      robotArms[i].base = shape
      robotArms[i].meshArm1 = meshArm1
      robotArms[i].meshArm2 = meshArm2
      robotArms[i].circle = shape2

      const line1 = drawLine(scene, [new Vector3(-14, robotArms[i].position1.y, robotArms[i].position1.z), new Vector3(14, robotArms[i].position1.y, robotArms[i].position1.z)], {color: robotArms[i].color})
      const line2 = drawLine(scene, [new Vector3(robotArms[i].position1.x, -24, robotArms[i].position1.z), new Vector3(robotArms[i].position1.x, 24, robotArms[i].position1.z)], {color: robotArms[i].color})
    
      robotArms[i].line1Geometry = line1.geometry
      robotArms[i].line2Geometry = line2.geometry

      const middlePoint = middleArm.middlePoint
      const middleArmLine = drawLine(scene, [new Vector3(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z), new Vector3(middlePoint.x, middlePoint.y, middlePoint.z)], {color: "#F15156", lineWidth: middleArm.width})

      

      middleArm.armsLines[i] = middleArmLine.geometry
    } else {
      const {base, meshArm1, meshArm2, circle, line1Geometry, line2Geometry} = robotArms[i]
      const middlePoint = middleArm.middlePoint

      base.position.set(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z);
      
      meshArm1.position.set(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z);
      meshArm1.rotation.z = robotArms[i].rotation1
      //scene.add(meshArm1);
    
      meshArm2.position.set(robotArms[i].position2.x, robotArms[i].position2.y, robotArms[i].position2.z);
      meshArm2.rotation.z = robotArms[i].rotation2
      //meshArm1.add(meshArm2);
      
      circle.position.set(robotArms[i].position2.x, robotArms[i].position2.y, robotArms[i].position2.z);

      
      // console.log(middleArm)
      updateLineGeometryPositions(line1Geometry, [new Vector3(-14, robotArms[i].position1.y, robotArms[i].position1.z), new Vector3(14, robotArms[i].position1.y, robotArms[i].position1.z)])
      updateLineGeometryPositions(line2Geometry, [new Vector3(robotArms[i].position1.x, -24, robotArms[i].position1.z), new Vector3(robotArms[i].position1.x, 24, robotArms[i].position1.z)])
      updateLineGeometryPositions(middleArm.armsLines[i], [new Vector3(robotArms[i].position1.x, robotArms[i].position1.y, robotArms[i].position1.z), new Vector3(middlePoint.x, middlePoint.y, middlePoint.z)])
    }

  }


  let nearDrawPoint = null

  const updateRobotArm = (options) => {
    const i = options?.i || 0
    const drawPosition = options?.drawPosition || new Vector3(0,0,0)
    const robotArmLength1 = options?.robotArmLength1 || 3
    const robotArmLength2 = options?.robotArmLength2 || 3

    
    
    const distToPoint = robotArms[i].position1.distanceTo(drawPosition)
    const isInReach = (robotArmLength1 + robotArmLength2) > distToPoint

    const distToClosePoint = robotArms[i].nearDrawPoint ?new THREE.Vector2(robotArms[i].position1.x, robotArms[i].position1.y).distanceTo(new THREE.Vector2( robotArms[i].nearDrawPoint.x, robotArms[i].nearDrawPoint.y)) : 0
    
    
    
    const dx = drawPosition.x - robotArms[i].position1.x
    const dy = drawPosition.y - robotArms[i].position1.y
      
    const angleToPoint = Math.atan2(dy, dx)

    const armSpeed1 = 1
    const armDistanceThreshold = 0.1

    if (robotArms[i].nearDrawPoint && distToClosePoint > armDistanceThreshold) {
      // console.log(distToClosePoint, robotArms[i].position1, nearDrawPoint)
      // move slowly toward near draw point
      // robotArms[i].position1 = robotArms[i].position1.lerp(nearDrawPoint, at % 1)
      const dxc = robotArms[i].nearDrawPoint.x - robotArms[i].position1.x
      const dyc = robotArms[i].nearDrawPoint.y - robotArms[i].position1.y
    
      const angleToClose = Math.atan2(dyc, dxc)
      let moveSpeed = distToClosePoint > armSpeed1 ? armSpeed1 : armDistanceThreshold
      if (moveSpeed < 0.05) moveSpeed = 0.05
      //console.log(moveSpeed)
      const directionToMove = new Vector3(
        moveSpeed*sin(angleToClose+PI/2)  ,
        moveSpeed*cos(angleToClose-PI/2),
        0
      )
      robotArms[i].position1.add(directionToMove)
    } else if (robotArms[i].nearDrawPoint && distToClosePoint < armDistanceThreshold) {
      robotArms[i].position1 = robotArms[i].nearDrawPoint.clone()
    }


    //robotArms[i].rotation1 = at
    //robotArms[i].rotation2 = at
    
    
    
    robotArms[i].rotation1 = angleToPoint
    robotArms[i].rotation2 = 0
    

    const firstDeformAngle = acos((distToPoint*distToPoint + robotArmLength1*robotArmLength1 - robotArmLength2*robotArmLength2)/(2*robotArmLength1*distToPoint))
    
    
    const secondDeformAngle = acos((robotArmLength1*robotArmLength1 + robotArmLength2*robotArmLength2- distToPoint*distToPoint)/(2*robotArmLength1*robotArmLength2))
    
    // not sure why -PI makes it work
    if (distToPoint < robotArmLength1 + robotArmLength2) {
      robotArms[i].rotation1 = angleToPoint + firstDeformAngle
      robotArms[i].rotation2 = secondDeformAngle - PI
    } else {
      // robotArms[i].rotation1 = angleToPoint
      // robotArms[i].rotation2 = 0
    }

    robotArms[i].position2 = new Vector3(
      robotArmLength1 * sin(PI/2),
      robotArmLength1 * cos(PI/2),
      robotArms[i].position1.z
    )
      
    if (isInReach && distToClosePoint < 0.1) {
      robotArms[i].nearDrawPoint = null
      return true
    } else {
      if (!robotArms[i].nearDrawPoint) {
        robotArms[i].nearDrawPoint = drawPosition.clone().add(new Vector3(3*(random()-0.5),3*(random()-0.5),0))
      }
      return false
    }
    
    


    
  }

  //let progress = 0
  let drawnLines = []
  let drawnIndexes = {}
  const inProgressIndexes = {}

  const drawLinesImage = (linesArray, options) => {
    // linesArray is array:
    // [ [p1,p2,p3], [p4,p5,p6], [p7,p8,p9] ... ]
    const lineWidth = options.lineWidth || 2
    const color = options.color || "#000"
    const colorArray = options?.colorArray || []
    const lineOpacity = options.lineOpacity || 1
    const offset = options.offset || new Vector3(0,0,0)
    const t = options.t || 0
    const boringLineOptions = { lineWidth: lineWidth, color: color, opacity: lineOpacity }
    const scale = options?.scale || 1
    for (let i = 0; i < amountOfRobotArms; i++) {
      let progress = robotArms[i].progress
      let currentRobotArmDrawingIndex = robotArms[i].currentIndex
      if (currentRobotArmDrawingIndex === -1) {
        currentRobotArmDrawingIndex = floor(Math.random()*linesArray.length)
        robotArms[i].currentIndex = currentRobotArmDrawingIndex
      }
      // line break bug happens because of this
      // if speed is to high (value too low), the next line to draw will already be outside of current line, so it will just leave it as it is unfinished
      // need to add condition for when the line is going to break, then draw the line to the end
      const lineDrawSpeed = 0.5
      const pdt = 0.003
      const indexShift = 3
      // const init

      const currentLineIndex = (floor(progress/lineDrawSpeed) + currentRobotArmDrawingIndex) % linesArray.length
      const nextLineIndex = (floor((progress + dt/4)/lineDrawSpeed) + currentRobotArmDrawingIndex) % linesArray.length
      if (!drawnIndexes[String(currentLineIndex)]) {
        const lineSegmentSpeed = lineDrawSpeed/1
        // console.log(currentLineIndex, lineSegment)
        // currentPoint is just THREE.Vector3
        let currentPoint
        let nextPoint
        let buildUpIndex = 0
        let currentLine
        let amountOfLinesDrawn = 0
        const amountOfLines = linesArray.length
        for (let m = 0; m < currentLineIndex; m++) {
          amountOfLinesDrawn += linesArray[m].length
        }
        
        currentLine = linesArray[currentLineIndex]
        const lineSegment =
        //(((progress % lineDrawSpeed) / lineDrawSpeed))%1
        (((progress/lineDrawSpeed) % 1)*currentLine.length)%1
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // TODO: the problem with line breaking is because of the "progress" variable
        // it just too soon to next line if it progresses too fast
        // need to remove it and rethink how to progress through lines
        let currentLineSegment = floor((((progress/lineDrawSpeed) % 1)*currentLine.length))
        let nextLineSegment = floor(((((progress + dt/4)/lineDrawSpeed) % 1)*currentLine.length))
        // if (robotArms[i].upcomingLineSegment != -1 && currentLineSegment != robotArms[i].upcomingLineSegment) {
        //   currentLineSegment = robotArms[i].upcomingLineSegment
        // } else {
          
        //   // console.log("LOL")
        // }
        // robotArms[i].upcomingLineSegment = currentLineSegment + 1
        robotArms[i].currentLineSegment = currentLineSegment
        //floor(((progress % lineDrawSpeed)/lineDrawSpeed)*currentLine.length)
        currentPoint = currentLine[currentLineSegment][0]
        nextPoint = currentLine[currentLineSegment][1]
        //currentLine[(currentLineSegment + 1)%currentLine.length]

        
        /*
        for (let i = currentLineIndex; i < amountOfLines; i++) {
          const linesSize = linesArray[i].length
          if (amountOfLinesDrawn < linesSize + buildUpIndex) {
            currentLine = linesArray[i]
            currentPoint = currentLine[amountOfLinesDrawn - buildUpIndex]
            nextPoint = currentLine[amountOfLinesDrawn - buildUpIndex + 1]
            break;
          } else {
            buildUpIndex += linesSize
          }
        }
        */
        
        // for (let j = 0; j <= currentLineIndex; j++) {
          const nowLine = linesArray[currentLineIndex]
          // console.log(linesArray, j, nowLine)
          const lastSegment = currentLineSegment + 1
          if (reconstruct) {
          for (let k = 1; k < lastSegment; k++) {
            const previousPos = nowLine[k - 1]
            const nextPos = nowLine[k]
            const previousPosWithOffset = previousPos.clone().add(offset)
            const nextPosWithOffset = nextPos.clone().add(offset)
            const actualLineSize = (nowLine.length - k)/nowLine.length * (4-1) + 1
            drawLine(scene, [previousPosWithOffset, nextPosWithOffset], {...boringLineOptions, lineWidth: actualLineSize});
          }
          }
        // }

        if (
          currentPoint
          && currentLineSegment + 1 < currentLine.length
        ) {
          //console.log(currentPoint)
          const lineSeparation = pSin(progress*100) < 0.2 ? 1 : 0.1
          const trueLineSegment = (nextLineSegment == currentLineSegment ? lineSegment : 1)
          const actualLineSegment = trueLineSegment * lineSeparation
          const middlePoint = currentPoint.clone().lerp(nextPoint, actualLineSegment).add(offset)
          
          
          const drawSuccess = updateRobotArm({drawPosition: middlePoint, i:i})
          
          // console.log(currentLineSegment, nextLineSegment, robotArms[i].upcomingLineSegment)
          if (drawSuccess) {
            if (robotArms[i].upcomingLineSegment > currentLine.length) {
              robotArms[i].upcomingLineSegment = -1
            }
            // currentPoint is just THREE.Vector3, not array
            const actualLineSize = 
            (currentLine.length - currentLineSegment)/currentLine.length 
            //lineSegment 
            * ((4-1) + 1) * lineWidth
            robotArms[i].progress += 
            pdt
            //(trueLineSegment/currentLine.length*lineDrawSpeed)
            
            const colorProgress = pSin(at/100 + currentLineIndex)*colorArray.length
            const colorLerp = colorProgress % 1
        
            const currentColorIndex = floor(colorProgress)
            const nextColorIndex = (currentColorIndex + 1)%colorArray.length
        
            const color1 = colorArray[currentColorIndex] ? new THREE.Color(colorArray[currentColorIndex]) : null
            const color2 = colorArray[nextColorIndex] ? new THREE.Color(colorArray[nextColorIndex]) : null
        
            const colorValue = color1?.lerp(color2, colorLerp)
            drawLine(scene, [currentPoint, middlePoint], {...boringLineOptions, lineWidth: actualLineSize, color: colorArray.length < 0 ? color : colorValue});
          }
        } else {
          // console.log(currentLineSegment, currentLine.length)
          // if (currentLineSegment + 1 >= currentLine.length) {
          if (!drawnIndexes[String(currentLineIndex)]) {
            //drawnLines.push(currentLine)
            drawnIndexes[String(currentLineIndex)] = linesArray[currentLineIndex]
            robotArms[i].currentIndex = -1
            robotArms[i].upcomingLineSegment = -1
            // delete dumbStoreIndexes[String(currentLineIndex)]
          }
          // }
          robotArms[i].progress += (pdt)
        }
      } else {
        robotArms[i].currentIndex = -1
      }
      
      if (reconstruct) {
      const drawKeys = Object.keys(drawnIndexes)
      for (let j = 0; j < drawKeys.length; j++) {
        const nowLine = drawnIndexes[drawKeys[j]]
        for (let k = 0; k < nowLine.length-1; k++) {
          const previousPos = nowLine[k]
          const nextPos = nowLine[k+1]
          const actualLineSize = (nowLine.length - k)/nowLine.length * (4-1) + 1
          const previousPosWithOffset = previousPos.clone().add(offset)
          const nextPosWithOffset = nextPos.clone().add(offset)
          drawLine(scene, [previousPosWithOffset, nextPosWithOffset], {...boringLineOptions, lineWidth: actualLineSize});
        }
      }
      }
    }
    middleArm.middlePoint = robotArms.reduce((a,b) => a.add(b.position1), new Vector3(0,0,0)).divideScalar(amountOfRobotArms)
  }

  const randomPoseData = [
    testPose1,
    testPose2,
    testPose3,
    testPose4,
    testPose5
  ]



  function randomPeople(scene) {
    const amountOfPeople = 4
    for (let i = 0; i < amountOfPeople; i++) {
      const randomPaletteIndex = floor(random()*flowersPalette1.length)
      const randomPaletteIndex2 = floor(random()*flowersPalette1.length)
      const randomPaletteColor = flowersPalette1[randomPaletteIndex]
      const randomPaletteColor2 = flowersPalette1[randomPaletteIndex2]
      const randomPose = randomPoseData[Math.floor(Math.random() * randomPoseData.length)]
      const randomOffset = new Vector3(
        seededRandomRange(-3,3,(i + 1) * 23424),
        seededRandomRange(-1,0,(i + 1) * 11235),
      0)
      
      pattern1Person(scene, {poses:  [generateRandomPose()], offset: randomOffset, scale: 0.4, clothColor: "#000000", t: at})

      // basicPerson(scene, {pose: randomPose, offset: randomOffset, scale: 0.4, hasOutline: true,
      //   clothColor: randomPaletteColor,
      //   // outlineColor: "#44ff99"
      //   outlineColor: "#0000ff"
      //   // outlineColor: randomPaletteColor2
      // })
    }
  }

// Source - https://stackoverflow.com/a/48768960
// Posted by 欧阳维杰, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-31, License - CC BY-SA 4.0

function clearThree(obj){
  while(obj.children.length > 0){ 
    clearThree(obj.children[0]);
    obj.remove(obj.children[0]);
  }
  if(obj.geometry) obj.geometry.dispose();

  if(obj.material){ 
    //in case of map, bumpMap, normalMap, envMap ...
    Object.keys(obj.material).forEach(prop => {
      if(!obj.material[prop])
        return;
      if(obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')                                  
        obj.material[prop].dispose();                                                      
    })
    obj.material.dispose();
  }
}   


  function saveFrame(dataURL, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //doPhotoLayer(scene)
  
  function animate() {

    if (saveFrames && currentFrameName >= (startFrame + framesToSave)) return;
    if (!saveFrames && !precheck) requestAnimationFrame(animate);
    //updateRobotArm()
    //scene.remove.apply(scene, scene.children);
    if (reconstruct) clearThree(scene);
    //while(scene.children.length > 0) {scene.remove(scene.children[0])}
    //testGround()
    //pictureFactory1()
    swarm1(scene, {t: at, textures: [pigeonTexture1, pigeonTexture2]})
    // dancePerson1(scene, {offset: new Vector3(-1.5,0,2)})
    // dancePerson2(scene, {offset: new Vector3(1.5,0,2)})
    // basicPerson(scene, {pose: testPose5, offset: new Vector3(0,0,2), scale: 1, hasOutline: true})
    //randomPeople(scene)
    // pattern1Person(scene, {poses:  [generateRandomPose()], scale: 1, hasOutline: false, clothColor: "#000000", outlineColor: "#0000ff", t: at})
    // lisa(scene)
    // moveShapes(meshArray)
    // doLines(linesArray)
    // skeleton.bones[0].rotation.y += -Math.PI / 100;
    bt+=dt
    // at = sin(bt)
    at = bt/4
    renderer.render(scene, camera);
    if (saveFrames && currentFrame >= startFrame && currentFrame % skipFrames == 0) {
      const dataURL = renderer.domElement.toDataURL(format);
      saveFrame(dataURL, `frame_${String(currentFrameName - startFrame).padStart(4, '0')}.png`);
      currentFrameName++;
    }
    currentFrame++;
  }

  if (!saveFrames) {
    animate();
  } else {
    setInterval(animate,1000 /10)
  }
  //saveImage(renderer)
  // renderer.render( scene, camera );
}

main()
import * as THREE from 'three';

import { Vector3 } from 'three';
import { randInRange, pSin, pCos, distance3D, loadTextureF } from "./utils.js"
import { heartShape, birdShape } from "./shapes.js"
import { lisa } from './people.js';
//import wall from './assets/textures/wall.jpg';

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
  pallete
}
from "./consts.js"

import {pattern1} from "./patterns.js"

const {sin, cos, PI, random, pow} = Math;

const main = async () => {

  const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);

  camera.position.z = 10;
  camera.position.x = 0

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
  //const backColor = new THREE.Color("rgba(20, 20, 20, 1)");
  const backColor = new THREE.Color("#F63049")
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
  
  const testGround = async () => {
    const testPoints = [
      new Vector3(0,0,0),
      new Vector3(0,0.2,0),
      new Vector3(0.2,0.2,0),
      new Vector3(0.2,0,0)
    ]
    const middlePoint = testPoints.reduce((a,c) => a.add(c),new Vector3(0,0,0))
    testPoints.forEach(p => p.y -= 2)
    //await doText()
    pattern1(scene, testPoints, {
      initAngle: 0,
      //refPoint: middlePoint, 
      refPoint: new Vector3(0,-1,0),
      desiredAngle: -PI,
      angleToRef: true
    })
  }

  // lisa(scene)

  function animate() {
    //requestAnimationFrame(animate);

    testGround()
    lisa(scene)
    // moveShapes(meshArray)
    // doLines(linesArray)
    // skeleton.bones[0].rotation.y += -Math.PI / 100;

    renderer.render(scene, camera);
  }

  animate();
  // renderer.render( scene, camera );
}

main()
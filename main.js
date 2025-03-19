
import * as THREE from 'three';
import {randInRange,pSin,pCos,distance3D,loadTextureF} from "./utils.js"
import {heartShape,birdShape} from "./shapes.js"
//import wall from './assets/textures/wall.jpg';


const main = async () => {

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const texture = await loadTextureF(
  '/assets/textures/wall.jpg'
);
texture.colorSpace = THREE.SRGBColorSpace;


function prepLines() {
  const lines = []
  
  const material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

  const points = [];
  points.push( new THREE.Vector3( - 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 10, 0 ) );
  points.push( new THREE.Vector3( 10, 0, 0 ) );
  
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  
  const line = new THREE.Line( geometry, material );
  scene.add( line );
  lines.push(line)
  
  return lines
}

function prepTriangles() {
  const meshArray = []
  for (let i = 0; i < countBoxes; i++) {
  const subSize = [];
  const subPos = [];
  
  const randomSide = round(pSin(i * 56678) * 2)
  
  for (let d = 0; d < 3; d++) {
    const sizeD = randInRange(mnbs[d], mxbs[d], pSin(i * randRatio[d]));
    subSize.push(sizeD)
    
    // it is a little messed up, maybe there is some easier way to do it
    let pd = sin(randRatio[d] * i) * dbs[d] / 2;
    if (i == randomSide && abs(pd) < zs[d]/2) {
      pd = zs[d]/2 * sign(pd);
    }
    subPos.push(pd);
  }
  
  
  //const geometry = new THREE.BoxGeometry( subSize[0], subSize[0], subSize[0]*2 );
  const geometry= new THREE.ShapeGeometry( birdShape );
  let clr = {
    r: 0.8+pSin(i*130)*0.2,
    g: 0.5+pSin(i*150)*0.3,
    b: 0.3+pSin(i*180)*0.5
  }
  //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material = new THREE.MeshLambertMaterial( { color: new THREE.Color(clr.r,clr.g,clr.b) } );
  //const material = new THREE.MeshStandardMaterial({ map: texture, });
  const shape = new THREE.Mesh( geometry, material );
  
  shape.position.set(subPos[0], subPos[1], subPos[2]);
  
  shape.scale.x = subSize[0]
  shape.scale.y = subSize[0]
  shape.scale.z = subSize[0]
  
  shape.up = new THREE.Vector3(0,0,1)
  
  scene.add(shape)
  meshArray.push(shape)
  
}

//cubeGroup.rotation.x = 1;
return meshArray
}

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 2, 2, 2 );
scene.add( light );
const ambientLight = new THREE.AmbientLight( 0xffffff,0.9);
scene.add( ambientLight );

const backColor = new THREE.Color().setRGB( 0.7, 0.7, 0.7 );
scene.background = backColor

camera.position.z = 5;
let t = 0;
let pos = {
  x:0,
  y:0,
  z:0
}
let poss = []
for (let j=0; j< countBoxes;j++) {
  poss.push({
  x:0,
  y:0,
  z:0
})
}

function flyingTriangles(meshArray) {
  t+=0.0001;
  const totalShapes = meshArray.length;
	for(let i= 0; i < totalShapes; i++) {
	  const shapeChild = meshArray[i];
	  let shPos = shapeChild.position
	  const shSize = shapeChild.geometry.parameters
	  const shHeight = +shSize.height
	  const shScaleX = shapeChild.scale.x
	  let k = i - totalShapes/2
	  if (k < 0) {
	    k -=1
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
	  
	  const zAngle = t*500 + i/10
	  
	  shapeChild.rotation.z = -zAngle
	  shapeChild.position.x -= sin(zAngle)/100
	  shapeChild.position.y -= cos(zAngle)/100
	}
}
let x = 0, y = 0, z = 0;

const doLines = (lines) => {
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const positionAttribute = line.geometry.getAttribute( 'position' );
    
    
    
    for ( let i = 0; i < positionAttribute.count; i ++ ) {
      let px = positionAttribute.getX(i)
      let py = positionAttribute.getY(i)
      let pz = positionAttribute.getZ(i)
    
      px += ( Math.random() - 0.5 ) / 300;
      py += ( Math.random() - 0.5 ) / 300;
      pz += ( Math.random() - 0.5 ) / 300;
    
    
    	positionAttribute.setXYZ( i, px, py, pz );
    
        
    }
  }
}

const meshArray = prepTriangles()
const linesArray = prepLines()

console.log(linesArray)

function animate() {
	requestAnimationFrame( animate );
  
  flyingTriangles(meshArray)
  doLines(linesArray)
  
	renderer.render( scene, camera );
}

animate();
//renderer.render( scene, camera );
}

main()
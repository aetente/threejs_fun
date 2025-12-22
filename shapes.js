import * as THREE from 'three';

const x = 0, y = 0;
const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const birdShape = new THREE.Shape();
birdShape.moveTo(0, 0)
birdShape.lineTo(0.25, 1)

birdShape.lineTo(1.5,1)
birdShape.lineTo(1.75,1.5)
birdShape.lineTo(0.25,1.5)
birdShape.lineTo(0.15,2.25)
birdShape.lineTo(0.5,2.75)

birdShape.lineTo(-0.5,2.75)
birdShape.lineTo(-0.15,2.25)
birdShape.lineTo(-0.25,1.5)
birdShape.lineTo(-1.75,1.5)
birdShape.lineTo(-1.5,1)

birdShape.lineTo(-0.25, 1)
birdShape.lineTo(0, 0)

export {heartShape,birdShape}
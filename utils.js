import * as THREE from 'three';

const randInRange = (xmin, xmax, randVal) => (
    (xmax - xmin) * randVal + xmin
  )

const pSin = (x) => (sin(x) + 1) / 2
const pCos = (x) => (cos(x) + 1) / 2

const distance3D = (a,b) => {
  return sqrt(a.x*b.x + a.y*b.y + a.z*b.x)
}

const loadTextureF = async (url) => {
  return new Promise((resolve, reject) => {
    let texture;
    let onLoadF = function () {
      resolve(texture);
      
    };
    let onProgressF = function () { };
    let onErrorF = function (url) {
      resolve(false);
      
    };
    let managerv = new THREE.LoadingManager(onLoadF, onProgressF, onErrorF);
    let loaderv = new THREE.TextureLoader(managerv);
    texture = loaderv.load(url);
   });
}

export {randInRange,pSin,pCos,distance3D, loadTextureF}
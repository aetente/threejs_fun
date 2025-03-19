const {sign, sin, cos, floor, random, abs, pow, round, sqrt,PI} = Math;

const dbs = [1,1,1]; //default box size
const zs = [0.9, 0.9, 0.9]; // no go zone size
const countBoxes = 10;
const mnbs = [0.1,0.1,0.1]; //minimum box size
const mxbs = [0.3,0.3,0.3]; //maximum box size
const dclr = {r: 0.9, g: 0.9, b: 0.9}; // default color
const randRatio = [24647, 53774, 33784]; // ratio/seeds for random numbers for xyz

const { sign, sin, cos, floor, random, abs, pow, round, sqrt, PI } = Math;

const dbs = [1, 1, 1]; //default box size
const zs = [0.9, 0.9, 0.9]; // no go zone size
const countBoxes = 1000;
const mnbs = [0.03, 0.03, 0.03]; //minimum box size
const mxbs = [0.2, 0.2, 0.2]; //maximum box size
const dclr = { r: 0.9, g: 0.9, b: 0.9 }; // default color
const randRatio = [24647, 53774, 33784]; // ratio/seeds for random numbers for xyz

const totalWidth = 3000
const totalHeight = 3000

const pallete = [
  "#6A2C70",
  "#B83B5E",
  "#F08A5D",
  "#F9ED69"
]

const hairPallete = [
  "#2d170e",
  "#4d2d1a",
  "#6d4730",
  "#a97e6d",
  "#cc9f88"
]

const facePallete = [
  "#F9DEC9",
  "#3F88C5",
  "#E9AFA3",
  "#F9DEC9"
]

const sunsetPallete = [
  "#fecd98",
  "#0453CA",
  "#f9605c",
  "#3c416b"
]

const sunsetPallete2 = [
  "#eeaf61",
  "#fb9062",
  "#ee5d6c",
  "#ce4993",
  "#6a0d83"
]

export {
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
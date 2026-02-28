import * as THREE from 'three';

import { Vector3 } from 'three';

import {applyPose, tPoseData, casualPoseData, sittingPoseData, sittingPhonePoseData, leapPoseData, relaxedSittingPhoneData, relaxedSittingPhoneAnglesData, rotatePose, sittingLegsClose} from "./poses.js"
import {getRectangleCorners, getAngleXYfrom3D} from "./utils.js"
import {
  curls,
  crazyCloth1,
  basicCloth,
  linesPatterns,
  drawHand,
  fillStarsBackground,
  face1,
  coat1,
  testPattern1,
  brokenPattern1,
} from "./backupFunctions.js"

const {sin, cos, PI, random, pow, floor} = Math;

function initSkeleton () {
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
  return skeleton
}

function lisa(scene) {

  const skeleton = initSkeleton()

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

  // fillStarsBackground(scene)
  
  curls(scene, headPosition.clone().add(new THREE.Vector3(0, 0.2, 0.6)) , 1.3)
  face1(scene, headPosition.clone().add(new THREE.Vector3(-0.1, 0.25, 0.5)))


  // crazyCloth1(upperTorsoShape, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(lowerTorsoShape, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(rightShouldRectangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(leftShouldRectangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(rightHandReactangle, {offset: new THREE.Vector3(0, 0, 1)})
  // crazyCloth1(leftHandReactangle, {offset: new THREE.Vector3(0, 0, 1)})

  linesPatterns(scene, [leftShoulderPosition, rootPosition, rightShoulderPosition], {rotation: -PI/3, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(scene, leftShouldRectangle, {rotation: -PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(scene, leftHandReactangle, {rotation: PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 1)})
  linesPatterns(scene, leftShouldRectangle, {rotation: -PI/3, amountOfLines: 40, offset: new THREE.Vector3(0, 0, -0.3)})

  linesPatterns(scene, rightShouldRectangle, {rotation: PI/1.6, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 0.3)})
  linesPatterns(scene, rightHandReactangle, {rotation: PI/20, lineLength: 0.4, offset: new THREE.Vector3(0, 0, 1)})

  linesPatterns(scene, leftLegRectangle, {rotation: PI/2.5, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(scene, leftFootReactangle, {rotation: PI/1.5, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(scene, rightLegRectangle, {rotation: PI * 1.1, lineLength: 0.7, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})
  linesPatterns(scene, rightFootReactangle, {rotation: -PI/4, amountOfLines: 20, offset: new THREE.Vector3(0, 0, 0.3), color: "#000000"})

  // basicCloth(scene, upperTorsoShape, {color: 0x333f33})
  // basicCloth(scene, lowerTorsoShape, {color: 0x333f33})
  // basicCloth(scene, rightShouldRectangle, {color: 0x333f33})
  // basicCloth(scene, leftShouldRectangle, {color: 0x333f33})
  // basicCloth(scene, rightHandReactangle, {color: 0x333f33})
  // basicCloth(scene, leftHandReactangle, {color: 0x333f33})
  // basicCloth(scene, rightLegRectangle, {color: 0xdfc300})
  // basicCloth(scene, rightFootReactangle, {color: 0xf3e333})
  // basicCloth(scene, leftLegRectangle, {color: 0xf3e333})
  // basicCloth(scene, leftFootReactangle, {color: 0xdfc300})
  // basicCloth([...leftLegRectangle, ...leftFootReactangle], {color: 0xf3f333})

  // coat1(upperTorsoShape, {scale: 10, amountOfRects: 100, radius: 0.1, radius2: 0.05, opacity: 0.5, offset: new THREE.Vector3(0, 0, 1)})
  // coat1(upperTorsoPosition, lowerTorsoPosition, {scale: 5, amountOfRects: 10})
  // coat1(leftShoulderPosition, leftElbowPosition, {scale: 2})
  // coat1(rightShoulderPosition, rightElbowPosition, {scale: 2})
  // coat1(rightElbowPosition, rightHandPosition, {scale: 2})
  // coat1(leftElbowPosition, leftHandPosition, {scale: 2})

  brokenPattern1(scene, upperTorsoShape, {initPoint: rootPosition, initAngle: getAngleXYfrom3D(rootPosition, upperTorsoPosition) + PI / 2})
  brokenPattern1(scene, lowerTorsoShape, {initPoint: lowerTorsoPosition, initAngle: getAngleXYfrom3D(lowerTorsoPosition , rootPosition) + PI / 2})
  brokenPattern1(scene, rightShouldRectangle, {initPoint: rightShoulderPosition, initAngle: getAngleXYfrom3D(rightShoulderPosition, rightElbowPosition)})
  brokenPattern1(scene, leftShouldRectangle, {initPoint: leftElbowPosition, initAngle: getAngleXYfrom3D(leftElbowPosition, leftShoulderPosition)})
  brokenPattern1(scene, rightHandReactangle, {initPoint: rightHandPosition, initAngle: getAngleXYfrom3D(rightHandPosition,rightElbowPosition)})
  brokenPattern1(scene, leftHandReactangle, {initPoint: leftHandPosition, initAngle: getAngleXYfrom3D(leftHandPosition,leftElbowPosition)})
  brokenPattern1(scene, rightLegRectangle, {initPoint: rightKneePosition, initAngle: getAngleXYfrom3D(rightKneePosition,rightLegPosition)})
  brokenPattern1(scene, rightFootReactangle, {initPoint: rightFootPosition, initAngle: getAngleXYfrom3D(rightFootPosition,rightKneePosition)})
  brokenPattern1(scene, leftLegRectangle, {initPoint: leftKneePosition, initAngle: getAngleXYfrom3D(leftKneePosition, leftLegPosition) + PI / 2})
  brokenPattern1(scene, leftFootReactangle, {initPoint: leftFootPosition, initAngle: getAngleXYfrom3D(leftFootPosition,leftKneePosition) + PI / 2})

  // drawHand(scene, copyRightHandPosition, {color: "#F9DEC9", rotation: rightHandRotation, handSize: new THREE.Vector3(0.1, 0.2, 0.01), offset: new THREE.Vector3(0.05, -0.1, 0)});
  // drawHand(scene, copyLeftHandPosition, {color: "#F9DEC9", rotation: leftHandRotation, handSize: new THREE.Vector3(0.1, 0.2, 0.01), offset: new THREE.Vector3(0.1, -0.05, 0)});
}

export { initSkeleton, lisa }
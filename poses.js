import * as THREE from 'three';

function applyPose(poseData, skeleton) {
    console.log("skeleton", skeleton)
    poseData.forEach(data => {
        const bone = skeleton.getBoneByName(data.name);
        if (bone) {
            if (data.pos) bone.position.copy(data.pos);
            if (data.rot) bone.rotation.copy(data.rot);
        } else {
            console.log("not found bone", data.name)
        }
    });
    skeleton.update();
}


// Define your pose data
const myPose = [
    { name: 'lowerTorso', position: new THREE.Vector3(0, 1, 0) },
    { name: 'leftShoulder', position: new THREE.Vector3(0.2, 0.5, 0) },
    { name: 'rightShoulder', position: new THREE.Vector3(-0.2, 0.5, 0) },
    { name: 'head', position: new THREE.Vector3(0, 0.3, 0) }
    // ... add other bones as needed
];

// T-POSE: Perfect symmetry, arms out
const tPoseData = [
    { name: 'lowerTorso', pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftLeg', pos: new THREE.Vector3(0.1, -0.1, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightLeg', pos: new THREE.Vector3(-0.1, -0.1, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) }
];

// CASUAL POSE: Weight shifted, relaxed arms, slight twist
const casualPoseData = [
    { name: 'lowerTorso', pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0, 0, 0.15) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0, 0.2, -0.15) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(0, 0.3, -0.1) },
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, -1.2) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, -0.2) },
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.3, 0, 1.1) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0.4) },
    { name: 'leftLeg', pos: new THREE.Vector3(0.1, -0.1, 0), rot: new THREE.Euler(0, 0, -0.15) },
    { name: 'rightLeg', pos: new THREE.Vector3(-0.1, -0.1, 0), rot: new THREE.Euler(0.3, 0, 0.1) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(-0.6, 0, 0) }
];


export {applyPose, tPoseData, casualPoseData}
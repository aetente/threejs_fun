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
    // Core - Slight hip tilt and torso counter-rotation
    { name: 'lowerTorso', pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0, 0, 0.1) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0, 0.1, -0.1) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(0.1, 0.2, 0) },
    
    // Left Arm - Hanging relaxed
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, -1.3) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0.2, -0.2) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    
    // Right Arm - Slightly forward and relaxed
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.2, 0, 1.3) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0.3) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    
    // Left Leg - Straight weight-bearing leg
    { name: 'leftLeg', pos: new THREE.Vector3(0.1, -0.1, 0), rot: new THREE.Euler(0, 0, -0.1) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0, 0, 0) },
    
    // Right Leg - Relaxed and bent
    { name: 'rightLeg', pos: new THREE.Vector3(-0.1, -0.1, 0), rot: new THREE.Euler(0.3, 0, 0.1) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) }
];

const sittingPoseData = [
    // 1. Core - Lower the root and lean the spine back slightly
    { name: 'lowerTorso', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-0.1, 0, 0) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0.2, 0, 0) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(-0.1, 0.3, 0) },
    
    // 2. Left Leg - Bent at hip and knee
    { name: 'leftLeg', pos: new THREE.Vector3(0.15, -0.05, 0), rot: new THREE.Euler(1.4, 0.2, 0) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-1.5, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) },
    
    // 3. Right Leg - Opened slightly more to the side
    { name: 'rightLeg', pos: new THREE.Vector3(-0.15, -0.05, 0), rot: new THREE.Euler(1.4, -0.4, 0) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-1.5, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) },
    
    // 4. Left Arm - Resting on the lap
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0.5, 0, -0.2) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, -1.0) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },
    
    // 5. Right Arm - Relaxed at the side
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.3, 0, 0.4) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0.8) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) }
];

const sittingPhonePoseData = [
    // 1. Core - Leaned back and slightly twisted toward the phone hand
    { name: 'lowerTorso', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-0.2, 0, 0.1) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0.3, -0.1, -0.05) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(0.2, -0.4, -0.1) },

    // 2. Left Leg - Grounded leg (Supporting the other)
    { name: 'leftLeg', pos: new THREE.Vector3(0.15, -0.05, 0), rot: new THREE.Euler(1.3, 0.1, 0.1) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-1.5, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) },

    // 3. Right Leg - Crossed over the left
    { name: 'rightLeg', pos: new THREE.Vector3(-0.15, -0.05, 0), rot: new THREE.Euler(1.5, 0.6, 0.2) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-1.6, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.4, 0, 0) },

    // 4. Left Arm - Reaching forward for the "Table"
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0.8, 0, -0.4) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, -1.2) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, 0.5) },

    // 5. Right Arm - Holding "Phone" near face
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(1.1, -0.5, 0.8) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 2.2) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.5, 0, 0) }
];

const leapPoseData = [
    // 1. Core - Dramatic lean and arch
    { name: 'lowerTorso', pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0.4, 0, 0.8) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.5, 0), rot: new THREE.Euler(0.3, 0, 0.5) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(-0.2, 0.3, 0.2) },

    // 2. Left Arm - Curving upward and back
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(-1.2, 0, 0.5) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, -1.8) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0, 0, -0.5) },

    // 3. Right Arm - Sweeping down and out
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.8, 0, 1.2) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0.7) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },

    // 4. Left Leg - Trailing behind/above
    { name: 'leftLeg', pos: new THREE.Vector3(0.1, -0.1, 0), rot: new THREE.Euler(-0.8, 0, -0.4) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.3, 0, 0) },

    // 5. Right Leg - Leading the fall/leap (The sharp curve at the bottom)
    { name: 'rightLeg', pos: new THREE.Vector3(-0.1, -0.1, 0), rot: new THREE.Euler(0.6, 0, 1.1) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(-1.2, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.5, 0, 0) }
];

const relaxedSittingPhoneData = [
    //{ name: "root", pos: new THREE.Vector3(0,0,0), rot: new THREE.Euler(0.5,0,0)},
    // 1. Core - Comfortable seated tilt
    { name: 'lowerTorso', pos: new THREE.Vector3(0, -0.2, -0.2), rot: new THREE.Euler(0.1, 0, 0) },
    { name: 'upperTorso', pos: new THREE.Vector3(0, 0.3, 0.2), rot: new THREE.Euler(0, 0, 0) },
    { name: 'head', pos: new THREE.Vector3(0, 0.3, 0), rot: new THREE.Euler(0.4, 0.3, 0) },

    // 2. Left Arm - Leaning on armrest, holding phone
    // Shoulder is out to the side, elbow bent up
    { name: 'leftShoulder', pos: new THREE.Vector3(0.2, -0.1, 0), rot: new THREE.Euler(0.4, -0.5, -0.6) },
    { name: 'leftElbow', pos: new THREE.Vector3(0.3, 0, 0), rot: new THREE.Euler(0, 0, -2.0) },
    { name: 'leftHand', pos: new THREE.Vector3(0.2, 0, 0), rot: new THREE.Euler(0.5, 0, 0.5) },

    // 3. Right Arm - Relaxed on the right armrest
    { name: 'rightShoulder', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0.2, 0, 0.6) },
    { name: 'rightElbow', pos: new THREE.Vector3(-0.3, 0, 0), rot: new THREE.Euler(0, 0, 0.8) },
    { name: 'rightHand', pos: new THREE.Vector3(-0.2, 0, 0), rot: new THREE.Euler(0, 0, 0) },

    // 4. Left Leg - Regular sitting, slightly forward
    { name: 'leftLeg', pos: new THREE.Vector3(0.12, -0.05, 0), rot: new THREE.Euler(1.3, 0.1, 0) },
    { name: 'leftKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'leftFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) },

    // 5. Right Leg - Regular sitting, slightly forward
    { name: 'rightLeg', pos: new THREE.Vector3(-0.12, -0.05, 0), rot: new THREE.Euler(1.3, -0.1, 0) },
    { name: 'rightKnee', pos: new THREE.Vector3(0, -0.5, 0), rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'rightFoot', pos: new THREE.Vector3(0, -0.4, 0), rot: new THREE.Euler(0.2, 0, 0) }
];

const relaxedSittingPhoneAnglesData = [
    //{ name: "root", pos: new THREE.Vector3(0,0,0), rot: new THREE.Euler(0.5,0,0)},
    // 1. Core - Comfortable seated tilt
    { name: 'lowerTorso', rot: new THREE.Euler(0.1, 0, 0) },
    { name: 'upperTorso', rot: new THREE.Euler(0, 0, 0) },
    { name: 'head', rot: new THREE.Euler(0.4, 0.3, 0) },

    // 2. Left Arm - Leaning on armrest, holding phone
    // Shoulder is out to the side, elbow bent up
    { name: 'leftShoulder', rot: new THREE.Euler(0.4, -0.5, -0.6) },
    { name: 'leftElbow', rot: new THREE.Euler(0, 0, -2.0) },
    { name: 'leftHand', rot: new THREE.Euler(0.5, 0, 0.5) },

    // 3. Right Arm - Relaxed on the right armrest
    { name: 'rightShoulder', rot: new THREE.Euler(0.2, 0, 0.6) },
    { name: 'rightElbow', rot: new THREE.Euler(0, 0, 0.8) },
    { name: 'rightHand', rot: new THREE.Euler(0, 0, 0) },

    // 4. Left Leg - Regular sitting, slightly forward
    { name: 'leftLeg', rot: new THREE.Euler(1.3, 0.1, 0) },
    { name: 'leftKnee', rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'leftFoot', rot: new THREE.Euler(0.2, 0, 0) },

    // 5. Right Leg - Regular sitting, slightly forward
    { name: 'rightLeg', rot: new THREE.Euler(1.3, -0.1, 0) },
    { name: 'rightKnee', rot: new THREE.Euler(-0.5, 0, 0) },
    { name: 'rightFoot', rot: new THREE.Euler(0.2, 0, 0) }
];


export {applyPose, tPoseData, casualPoseData, sittingPoseData, sittingPhonePoseData, leapPoseData, relaxedSittingPhoneData, relaxedSittingPhoneAnglesData}
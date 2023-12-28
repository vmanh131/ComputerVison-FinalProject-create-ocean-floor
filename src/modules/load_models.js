import { GLTFLoader  } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export var coralDict = [];

const gtlfLoader = new GLTFLoader();

export function loadModelAtPath(path, scene, startingZ) {
    gtlfLoader.load(path
    ,function ( gltf ) {
        var model = gltf.scene;
        var objs = [];
        model.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.name.includes('Coral')) {
                //console.log(obj.name);
                coralDict.push(obj);
                //obj.scale.set(0.1, 0.1, 0.1);
                //objs.push(obj);
                //scene.add(obj);
            }
        });
        alignObjects(objs, startingZ);
    },
    
    // called while loading is progressing
    function ( xhr ) {
    
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
    },
    // called when loading has errors
    function ( error ) {
    
        console.log( 'An error happened' + error.message);
    
    });
}

function alignObjects(objs, startingZ) {
    for (var i = 0; i < objs.length; i++) {
        objs[i].position.set(120 + i * 5, 0, 60 + startingZ * 5);
    }
}
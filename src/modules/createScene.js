import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader  } from 'three/addons/loaders/GLTFLoader.js';

var scene;
const exporter = new GLTFExporter();
const textureLoader = new THREE.TextureLoader();

// var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
// var boxMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
// export var tempMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// tempMesh.name = 'Box';


export function createScene() {
    scene = new THREE.Scene();
    var planeGeometry = new THREE.PlaneGeometry(15, 15);
    var platformTexture = textureLoader.load('textures/sand_texture_2.jpg');
    var planeMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
    var surface = new THREE.Mesh( planeGeometry, planeMaterial );
    surface.receiveShadow = true;
    surface.rotateX(-Math.PI / 2);
    surface.position.copy(new THREE.Vector3(0, -2, 0));
    scene.add(surface);

    // const light = new THREE.DirectionalLight(0xffffff, 2);
    // const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff,5);
    // scene.add(hemisphereLight);
        
        //scene.add(tempMesh);
    
        const gtlfLoader = new GLTFLoader();
        gtlfLoader.load('./scenes/coral-reef.glb'
        ,function ( gltf ) {
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.position.set(0, -7.8, 0);
            gltf.scene.rotation.set(0, 45 * Math.PI / 180, 0);
            scene.add(gltf.scene);
        },
    
        // called while loading is progressing
        function ( xhr ) {
    
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened ' + error.message);
    
        });
    
    return scene;
}

export function saveScene() {
    scene.remove(tempMesh);
        exporter.parse(
            scene,
            // called when the gltf has been generated
            function ( gltf ) {
        
                console.log( gltf );
                const jsonString = JSON.stringify(gltf);
                download(jsonString, 'scene.gltf', 'text/plain');
                //downloadJSON( gltf );
        
            },
            // called when there is an error in the generation
            function ( error ) {
        
                console.log( 'An error happened' );
        
            }
        );
}

// export function createTempMesh() {
//     tempMesh.geometry = boxGeometry;
//     tempMesh.material = boxMaterial;
//     tempMesh.name = 'Box';
//     tempMesh.scale.set(.2, .2, .2);
// }

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
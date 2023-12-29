import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader  } from 'three/addons/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';

// let noise = new FastNoiseLite();
// noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);


function loadFile(filename) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FileLoader();

    loader.load(filename, (data) => {
      resolve(data);
    });
  });
}

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.domElement);

const width = window.innerWidth;
const height = window.innerHeight;

// Colors
const black = new THREE.Color('black');
const white = new THREE.Color('white');

// Constants
const waterPosition = new THREE.Vector3(0, 0, 3);
const near = 0.;
const far = 2.;
const waterSize = 512;

// Create Renderer
const scene = new THREE.Scene();
const causticsScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 100);
camera.position.set(-5, -5, 5);
camera.up.set(0, 0, 1);
scene.add(camera);
causticsScene.add(camera);

const causticsCamera = new THREE.PerspectiveCamera(70, 1, 0.01, 100);
causticsCamera.position.set(-5, 0, 20);
causticsCamera.rotation.set(0, 0, Math.PI / 2);
causticsCamera.up.set(0, 0, 1);
//scene.add(causticsCamera);
causticsScene.add(causticsCamera);

var tween = new TWEEN.Tween(causticsCamera.position);
tween.to({x: 5}, 20000).repeat(Infinity);

tween.start();


//scene.add(causticsGroup);

const cameraHelper = new THREE.CameraHelper(causticsCamera);
//scene.add(cameraHelper);
scene.add(cameraHelper);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(width, height);
renderer.autoClear = false;
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );


const temporaryRenderTarget = new THREE.WebGLRenderTarget(width, height);

// const spotLight = new THREE.DirectionalLight(0xffffff , 1);

const directLightCaustics = new THREE.HemisphereLight( 0xffffff, 0x080820, 15 );
const spotLight = new THREE.SpotLight( 0xffffff, 200, 25, 0.53, 1, 1 );
spotLight.position.set( 0, 0, 20 );


//spotLight.map = temporaryRenderTarget.texture;

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
spotLight.shadow.focus = 1;


scene.add(spotLight);
causticsScene.add(directLightCaustics)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Create mouse Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Clock
const clock = new THREE.Clock();

// Ray caster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const targetgeometry = new THREE.PlaneGeometry(2, 2);
const positionAttribute = targetgeometry.getAttribute( 'position' );
const vertex = new THREE.Vector3();
for ( let i = 0; i < positionAttribute.count; i ++ ) {

	vertex.fromBufferAttribute( positionAttribute, i ); // read vertex
	
	// do something with vertex

	positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z ); // write coordinates back

}
const targetmesh = new THREE.Mesh(targetgeometry);


// Environment
const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
//group.add(floorGeometry);


let envGeometries = [];

const gtlfLoader = new GLTFLoader();
const coralLoaded = new Promise((resolve, reject) => {
      gtlfLoader.load('./scenes/coral-reef.glb'
    ,function ( gltf ) {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, -5.8);
        gltf.scene.rotation.set(Math.PI / 2, Math.PI / 4, 0);
        scene.add(gltf.scene);

        const model = gltf.scene;
        model.traverse( function( child ) {
          if (child instanceof THREE.Mesh)
            envGeometries.push(child.geometry);
            child.receiveShadow = true;
        });
        model.receiveShadow = true;
        //coralreef = gltf.scene.geometries;
    },

    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        resolve();

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened ' + error.message);
        reject();

    });
  });


//////////////////////////////////////////

const loader = new GLTFLoader();
//const clock = new THREE.Clock();
let mixer;
var mixers = [];  
var basePath = './models/'; 

var models = [
  { name: 'shark', position: { x: 1, y: 1, z: 2.2 }, rotation: -Math.PI/2, scale: 0.2 },
  { name: 'dolphin', position: { x: -2.5, y: -1.5, z: 2.5 }, rotation: -Math.PI/2, scale: 0.5 },
  { name: 'clown_fish', position: { x: -1, y: -1, z: 0.7 }, rotation: Math.PI/2, scale: 0.002 },
  { name: 'seaturtle', position: { x: -2.2, y: 2, z: 4 }, rotation: -Math.PI/2, scale: 0.06 },
  { name: 'schoolfish', position: { x: -0.2, y: 0.5, z: 1 }, rotation: -Math.PI/2, scale: 0.09 },
  { name: 'school_of_fish', position: { x: 0, y: 0, z: 1.7 }, rotation: -Math.PI/2, scale: 0.4 },
];

var sharkModel, dolphinModel, turtleModel, clownFishModel, schoolFishModel, schoolModel;

const fishGroup = new THREE.Group();
scene.add(fishGroup);

models.forEach(model => {
  loader.load(
    basePath + model.name + '/scene.gltf',
    function (gltf) {
      
      var object = gltf.scene;
      object.scale.set(model.scale, model.scale, model.scale);
      object.position.set(model.position.x, model.position.y, model.position.z);

      //scene.add(object);
      fishGroup.add(object);
      
      
      mixer = new THREE.AnimationMixer(object);
      mixers.push(mixer);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      if (model.name === 'shark') {
        sharkModel = object;
        
        sharkModel.rotation.y = - model.rotation;
        sharkModel.rotation.z = - model.rotation;
      }
      if (model.name === 'dolphin') {
        dolphinModel = object;
        dolphinModel.rotation.x = model.rotation;
        dolphinModel.rotation.y = - model.rotation * 0.5 ;
      }
      if (model.name === 'seaturtle') {
        turtleModel = object;
        turtleModel.rotation.x = - model.rotation;
        turtleModel.rotation.y = - model.rotation * 1.5;
      }
      if (model.name === 'clown_fish') {
        clownFishModel = object;
        clownFishModel.rotation.z = model.rotation;
        clownFishModel.rotation.y = model.rotation;
      }
      if (model.name === 'schoolfish') {
        schoolFishModel = object;
        //schoolFishModel.rotation.z = model.rotation;
        schoolFishModel.rotation.x = - model.rotation;
      }
      if (model.name === 'school_of_fish') {
        schoolModel = object;
        // schoolModel.rotation.z = model.rotation;
        schoolModel.rotation.x = - model.rotation;
      }
    },
  );
});


var timer = 0, timer1 = 0, timer2 = 0, timer3 = 0;

function moveCircle(fish, deltaTime){
  //move shark
  if(fish == sharkModel){
    if(timer > 50 ){
      timer = 0;
    }
  timer += deltaTime;

  fish.position.x += 0.005 * Math.sin(timer / 30 * Math.PI * 2) ;
  fish.position.y += 0.005 * Math.cos(timer / 30 * Math.PI * 2);
  fish.position.z += 0;
  }

  //moveDolphin
  if(fish == dolphinModel){
    
    dolphinModel.rotation.z = Math.PI;
    
    if(timer1 > 50 ){
      timer1 = 0;
    }
  timer1 += deltaTime;

  fish.position.x += 0.02 * Math.sin(timer1 / 40 * Math.PI * 2) ;
  fish.position.y += 0.02 * Math.cos(timer1 / 40 * Math.PI * 2);
  fish.position.z += 0;
  }

  //moveTurtle
  if(fish == turtleModel){
    if(timer2 > 50 ){
      timer2 = 0;
    }
  timer2 += deltaTime;
  

  fish.position.x += 0.005 * Math.sin(timer2 / 30 * Math.PI * 2) ;
  fish.position.y += 0.01 * Math.cos(timer2 / 30 * Math.PI * 2);
  fish.position.z += 0;

  }


  //moveclownfish
  if(fish == clownFishModel){

  timer3 += deltaTime;

  fish.position.x += 0.005 * Math.cos(timer3 / 30 * Math.PI * 2);
  fish.position.y += 0;
  fish.position.z += 0;

  }
}

function moveFish(deltaTime) {
  fishGroup.children.forEach((fish, index) => {

    moveCircle(fish, deltaTime);

      
  });
}



////////////////////////////////////////



// Skybox
const cubetextureloader = new THREE.CubeTextureLoader();

const skybox = cubetextureloader.load([
  'assets/TropicalSunnyDay_px.jpg', 'assets/TropicalSunnyDay_nx.jpg',
  'assets/TropicalSunnyDay_py.jpg', 'assets/TropicalSunnyDay_ny.jpg',
  'assets/TropicalSunnyDay_pz.jpg', 'assets/TropicalSunnyDay_nz.jpg',
]);

scene.background = skybox;

const textureLoader = new THREE.TextureLoader();
const sand_texture = textureLoader.load('textures/sand_texture_2.jpg' ); 

const white_texture = textureLoader.load('textures/caustics_texture.png' );
const caustics_texture = textureLoader.load('textures/CausticsRender_003.png' );

// immediately use the texture for material creation 

const material = new THREE.MeshStandardMaterial( { map: sand_texture } );
//material.skinning = true;
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMesh = new THREE.Mesh(planeGeometry, material);
planeMesh.position.set(0, 0, 0);
planeMesh.receiveShadow = true;

//causticsScene.add(planeMesh);
scene.add(planeMesh);

const materialCaustics = new THREE.MeshStandardMaterial( { map: caustics_texture, transparent: true, alphaTest: 0.7});
const causticsMesh = new THREE.Mesh(planeGeometry, materialCaustics);
  causticsMesh.position.set(5, 0, 5);
  causticsScene.add(causticsMesh);

  const causticsMesh2 = new THREE.Mesh(planeGeometry, materialCaustics);
  causticsMesh2.position.set(-5, 0, 5);
  causticsScene.add(causticsMesh2);

  spotLight.map = temporaryRenderTarget.texture;



var count = 1;

// Main rendering loop
function animate() {
  stats.begin();

  renderer.setRenderTarget(temporaryRenderTarget);
  
  renderer.clear();
  renderer.render(causticsScene, causticsCamera);

  renderer.setRenderTarget(null);
  renderer.clear();

  renderer.render(scene, camera);

  //////movefish
  var delta = clock.getDelta(); 
  for (var i = 0; i < mixers.length; i++) { 
    var mixer = mixers[i];
    mixer.update(delta);
  }
  moveFish(delta);


  controls.update();
  TWEEN.update();
  stats.end();

  requestAnimationFrame(animate);
}

const loaded = [
   coralLoaded
];


Promise.all(loaded).then(() => {
 
  animate();
});
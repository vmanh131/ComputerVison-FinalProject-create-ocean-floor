import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

export function editUpdate(scene, camera, coralDict) {
    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length != 0) {
        if (intersects[0].object.name)
        var coral = coralDict[intersects[0].object.name].clone();
        coral.scale.set(0.1, 0.1, 0.1);
        scene.add(coral);
    }
};

//window.addEventListener( 'pointermove', onPointerMove );
import { GUI } from 'dat.gui';

const options = {
    editMode: false,
    viewMode: true
}

var gui = new GUI();

export function initUIController(onEditCallback, onViewCallback) {
    var menu = gui.addFolder('Menu');
    
    onViewCallback();
    menu.add(options, 'editMode').listen().onChange(() => {
        options.viewMode = !options.editMode;
        onEditCallback();
    });
    menu.add(options, 'viewMode').listen().onChange(() => {
        options.editMode = !options.viewMode;
        onViewCallback();
    });
    //menu.add(text, 'displayOutline');
    //menu.hide();

    var customContainer = document.getElementById('moveGUI');
    customContainer.appendChild(gui.domElement);
}

export function initCoralPallete() {
    for (var i = 0; i < 3; i++) {
        var obj = { add:function(){ console.log("clicked") }};
        gui.add(obj,'add');
    }
}
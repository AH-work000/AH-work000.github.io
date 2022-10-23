// Import all relevant Three JS Libraries
import * as THREE from '../snow-forest/modules/three.module.js';
import { OrbitControls } from '../snow-forest/modules/OrbitControls.js';
import { OBJLoader } from '../snow-forest/modules/OBJLoader.js'; 
import { MTLLoader } from '../snow-forest/modules/MTLLoader.js'; 

// Import the GUI controls
import {GUI} from "../snow-forest/modules/dat.gui.module.js";


// -------------------------------------------------------------------------

// SUPPLEMENTARY FUNCTION --- GETTING A RANDOM INT

    // Based on the example provided by Borislav Hadzhiev: 
    // https://bobbyhadz.com/blog/javascript-get-random-float-in-range

    function getRandomInt(inclusiveMin, inclusiveMax) {
        return Math.floor(Math.random() * (inclusiveMax - inclusiveMin + 1 ) ) + inclusiveMin;
    }



// -------------------------------------------------------------------------

// RENDERER
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38478E);
    var ratio = window.innerWidth/window.innerHeight;

    // Create a new renderer
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);


// -------------------------------------------------------------------------

// CREATE THE GUI FOR TESTING
    const gui = new GUI( {autoPlace: false, width: 500} );  

    // Link the Dat GUI to HTML and CSS
    gui.domElement.id = 'gui';
    guiBox.appendChild(gui.domElement); 



// -------------------------------------------------------------------------

// SET UP THE PROPERTIES OF THE CAMERA

    var camera = new THREE.PerspectiveCamera(40, ratio, 0.1, 10000);

    camera.position.set(50, 100, 150);
    camera.lookAt(0,1,1);

    // Add the camera to the scene
     scene.add(camera);


// -------------------------------------------------------------------------

// ADD POINT LIGHT TO THE SCENE
    var pointLight = new THREE.PointLight( 0xFFFAFA, 0.2);
    pointLight.position.x = 0.0;
    pointLight.position.y = 50;
    pointLight.position.z = 0.0; 

    pointLight.power = 56; 
    pointLight.intensity = 4; 
    pointLight.decay = 1.24; 
    scene.add(pointLight); 

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);


// -------------------------------------------------------------------------

// ADD THE AMBIENT LIGHTING
    var ambientLight = new THREE.AmbientLight(0xF4E99B);
    ambientLight.intensity = 42.5; 
    scene.add(ambientLight); 


// -------------------------------------------------------------------------

// FLAT PLANE FOR SURFACE -- USE MESHBASICMATERIAL TO IGNORE THE LIGHTING EFFECTS

    //  Create the geometry for flat plane surface
    var surfaceGeometry = new THREE.PlaneBufferGeometry(256, 256); 

    // Create the materials for flat plane surface
    var surfaceMaterial = new THREE.MeshBasicMaterial();
    surfaceMaterial.color = new THREE.Color(1, 0.98, 0.98);
    surfaceMaterial.shininess = 15;

    // Add the displacement and bump map for the snow mountain texture
    var snowTexture = new THREE.TextureLoader().load('img/snow_texture.jpg');
    surfaceMaterial.map = snowTexture; 

    // Add the normal map for the snow mountain texture
    var snowNormalMap = new THREE.TextureLoader().load('img/snow_texture_normal_map.jpg');
    surfaceMaterial.normalMap = snowNormalMap;  

    // Create the flat plane surface shape
    var surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.position.y -= 5;

    // Rotation Matrix around the x-axis: Make the flat surface to align horizontally without an angle
    var rotX =  new THREE.Matrix4();
    rotX.makeRotationX( (3 * Math.PI) / 2); // Rotate 270 degrees along x-axis 
    surface.applyMatrix4( rotX ); 

    // Add the flat plane to the scene
    scene.add(surface);


// -------------------------------------------------------------------------
    // ARRAY TO STORE A LIST OF URL REFERENCES TO MODELS
    let modelArr = ['WoodLog_Snow.obj', 'TreeStump_Snow.obj', 'Rock_Snow_1.obj', 'Rock_Snow_7.obj', 'Willow_Dead_Snow_1.obj', 
    'Willow_Dead_Snow_3.obj', 'Willow_Dead_Snow_4.obj', 'Bush_Snow_2.obj', 'BirchTree_Snow_1.obj', 'BirchTree_Snow_2.obj', 'CommonTree_Snow_1.obj', 'CommonTree_Snow_2.obj', 
    'CommonTree_Snow_3.obj', 'PineTree_Snow_1.obj', 'PineTree_Snow_2.obj', 'PineTree_Snow_3.obj']; 

    // ARRAY TO STORE A LIST OF URL REFERENCES TO MATERIALS OF MODELS
    let materialArr = ['WoodLog_Snow.mtl', 'TreeStump_Snow.mtl', 'Rock_Snow_1.mtl', 'Rock_Snow_7.mtl', 'Willow_Dead_Snow_1.mtl', 
    'Willow_Dead_Snow_3.mtl', 'Willow_Dead_Snow_4.mtl', 'Bush_Snow_2.mtl', 'BirchTree_Snow_1.mtl', 'BirchTree_Snow_2.mtl', 'CommonTree_Snow_1.mtl', 'CommonTree_Snow_2.mtl', 
    'CommonTree_Snow_3.mtl', 'PineTree_Snow_1.mtl', 'PineTree_Snow_2.mtl', 'PineTree_Snow_3.mtl']; 


// -------------------------------------------------------------------------

// ORBITCONTROLS
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; 


// -------------------------------------------------------------------------

// VALUE TO CONTROL THE SCALING OF ALL THE MODELS IN THE SCENE
    var ScaleProperties = {
        scaleValue: 10
    }

// -------------------------------------------------------------------------
// GLOBAL VALUES --- CREATE A NEW MTLLOADER
    var mtlLoader = new MTLLoader(); 


// -------------------------------------------------------------------------
// GLOBAL VALUES --- CREATE A NEW OBJLoader
    var objLoader = new OBJLoader();


// -------------------------------------------------------------------------
// LOAD A MODEL -- MATERIALS FIRST, THEN MODEL!!!

// LOAD PROCEDURE
    function LoadModel(material, object, xPos, zPos) {
        mtlLoader.setPath('Materials/')
        mtlLoader.load(material, function(materials) 
        {
            materials.preload();
            objLoader.setMaterials(materials); 
            objLoader.setPath('Models/');
            objLoader.load(object, function( mesh ) 
                {
                    // Matrix to scale the model 
                    var scale = new THREE.Matrix4();

                    var scaleValue = ScaleProperties.scaleValue; 
                    scale.makeScale(scaleValue, scaleValue, scaleValue);

                    mesh.applyMatrix4(scale); 

                    mesh.position.x = xPos; 
                    mesh.position.y -= 0; 
                    mesh.position.z = zPos; 
                    mesh.name = "Forest-Model"; 
                    scene.add(mesh);
                    mesh.castShadow = true; 
                });
        }); 
    }

// -------------------------------------------------------------------------

// ARRAYS TO STORE A LIST OF OCCUPIED POS VALUES SO FAR
    let xPosOccupied = []; 
    let zPosOccupied = [];


// -------------------------------------------------------------------------


// COLLISION CHECKING MECHANISM -- GENERATE A POSITION VALUE FOR X AND Z OF THE NATURE ITEM
    function generatePosValue(array) {
        var posValue; 

        if (array.length == 0) 
        {
            posValue = getRandomInt(-120, 120);
            array.push(posValue); 
            return posValue
        }
        else {
            // Check if there's an item already occipied at the position
            for (var i = 0; i < array.length; i++) {
                posValue = getRandomInt(-120, 120);
                if (posValue <= (array[i] - 25) || posValue >= (array[i] - 25)) {
                    array.push(posValue);
                    return posValue; 
                }
            }
        }
    }


// -------------------------------------------------------------------------

// ADD MODEL ONE AT A TIME DYNAMICALLY

var ItemsAmount = {
    numberOfObjInTheScene: 0,
    maxAmountOfObjects: 60
}
    
    function AddItem() {
            // Check if the number of objects in the scene is over the limit
            if (ItemsAmount.numberOfObjInTheScene <= ItemsAmount.maxAmountOfObjects) {
                var item = getRandomInt(0, (modelArr.length - 1)); 
                var xPos = generatePosValue(xPosOccupied);
                var zPos = generatePosValue(zPosOccupied);

                LoadModel(materialArr[item], modelArr[item], xPos, zPos); 
            }
        ItemsAmount.numberOfObjInTheScene++; 
    }


// -------------------------------------------------------------------------

// BOOL BUTTON TO CHECK IF THE A BUTTON HAS BEEN PRESSED DOWN
    var isGenerationOn = false; 

// ADD OPTION TO GENERATE NATURE ITEM USING "A" BUTTON
    var onKeyDown = function(event) {
        if (event.keyCode == 65) {
            isGenerationOn = true; 
        }
    }

// ADD OPTION TO GENERATE NATURE ITEM USING "A" BUTTON
    var touchDown = function(event) {
            isGenerationOn = true; 
    }

// -------------------------------------------------------------------------

// UI 
    var windowControlColl = document.getElementsByClassName("collapsibleWindowToggle");

    for (var i = 0; i < windowControlColl.length; i++) {
        windowControlColl[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var controlContent = this.nextElementSibling;
            if (controlContent.style.display === "block") {
                controlContent.style.display = "none";
            }
            else {
                controlContent.style.display = "block";
            }
        });
    }



// -------------------------------------------------------------------------

// RENDER UPDATE LOOP (ANIMATION LOOP)
    var renderUpdateLoop = function() {

        // Check if the number of nature items in the scene is less than the maximum amount of nature items
        if (ItemsAmount.numberOfObjInTheScene <= ItemsAmount.maxAmountOfObjects) {
            // Display the number of nature items in the scene based on the number of nature
            // items in the scene
            document.getElementById("itemsCount").innerHTML = ItemsAmount.numberOfObjInTheScene;
        } 
        else {
            // Display the number of nature items in the scene based on the max amount of objects
            document.getElementById("itemsCount").innerHTML = ItemsAmount.maxAmountOfObjects;
        }

        // console.log("xPosOccupied Array: " + xPosOccupied);
        // console.log("zPosOccupied Array: " + zPosOccupied);

        // Check if the 'A' key is pressed down
        if (isGenerationOn) {
            AddItem();
            isGenerationOn = false;  
        }

        // Re-render the scene
        renderer.render(scene, camera);

        // Update the OrbitControls
        controls.update();

        requestAnimationFrame(renderUpdateLoop);
    };

    requestAnimationFrame(renderUpdateLoop);


// -------------------------------------------------------------------------

// RESIZE WINDOWS

    var MyResize = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', MyResize);


// -------------------------------------------------------------------------
    
// ADD THE FOLLOWING GUI PROPERTIES

    // Add a GUI Function to rotate the point light in the x, y or z axis direction 
    var folderPointLight = gui.addFolder("Point Light");
    folderPointLight.add(pointLight.position, "x", -180, 180, 1);
    folderPointLight.add(pointLight.position, "y", 0, 180, 1);
    folderPointLight.add(pointLight.position, "z", -180, 180, 1); 
    folderPointLight.add(pointLight, "intensity", 0, 8, 0.2); 
    // folderPointLight.add(pointLight, "power", 0, 10, 0.2); 
    folderPointLight.add(pointLight, "decay", 1, 5, 0.01);

    // Add a GUI Function to adjust the intensity of the ambient light
    var folderAmbientLight = gui.addFolder("Base Model Light");
    folderAmbientLight.add(ambientLight, "intensity", 35, 50, 0.5).name("Base Light Intensity Of Models"); 

    // Switch the physically correct lights mode to on/off
    // True/False Checkbox
    renderer.physicallyCorrectLights = true; 
    // gui.add(renderer, "physicallyCorrectLights").name("Physically Correct Lights");

    // Add a GUI Function to adjust the maximum amount of items in the scene
    var folderModels = gui.addFolder("Model Generation Settings");
    folderModels.add(ItemsAmount, "maxAmountOfObjects", 10, 100, 1).name("Maximum Amount Of Objects").onChange( function(val) {
        ItemsAmount.maxAmountOfObjects = val; 
    }); 


// -------------------------------------------------------------------------

// REFRESH FOREST BUTTON
    var refreshForestBtn = document.getElementById("refreshButton");
    refreshForestBtn.addEventListener("click", function() {
        for (var i = 0; i <= ItemsAmount.maxAmountOfObjects; i++) {
            var objectToRemove = scene.getObjectByName("Forest-Model");
            scene.remove( objectToRemove ); 
            ItemsAmount.numberOfObjInTheScene = 0; 
        }

        console.log("Refesh Button Pressed!");
    });


// -------------------------------------------------------------------------

// ADD OPTION TO GENERATE NATURE ITEM USING "A" BUTTON OR TOUCHING THE SCREEN
    document.addEventListener( 'keydown', onKeyDown, false); 
    document.addEventListener( 'touchstart', touchDown, false);

// -------------------------------------------------------------------------


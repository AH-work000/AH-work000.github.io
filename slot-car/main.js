// Import all relevant External Three JS Libraries
import * as THREE from '../slot-car/external-js/three.module.js';
import * as YUKA from '../slot-car/external-js/yuka.module.js'; 
import { OrbitControls } from '../slot-car/external-js/OrbitControls.js';
import { OBJLoader } from '../slot-car/external-js/OBJLoader.js';
import { MTLLoader } from '../slot-car/external-js/MTLLoader.js';

// Import all relevant Internal (Auxillary) Three JS Modules
import * as TRACK from '../slot-car/track.js';
import * as BOUNDINGBOX from '../slot-car/boundingBox.js'; 
import * as SCENEOBJECTS from '../slot-car/sceneObjects.js'; 
import * as FLATSURFACE from '../slot-car/flatSurface.js'; 
import * as CARPHYSICS from '../slot-car/carPhysics.js';
import * as UI from "../slot-car/UI.js"; 
import * as PARTICLE from "../slot-car/particle.js"; 

// Import the GUI controls
import { GUI } from '../slot-car/external-js/dat.gui.module.js'; 
import { keiCarInnerProperities, keiCarOuterProperities } from '../slot-car/carPhysics.js';


// -------------------------------------------------------------------------

    // SET-UP THE SCENE

        // -------------------------------------------------------------------------

        // RENDERER
            export var scene = new THREE.Scene();
            export var ratio = window.innerWidth/window.innerHeight;
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild(renderer.domElement);


        // -------------------------------------------------------------------------

        // PRESPECTIVE CAMERA
            var mainPerspectiveCamera = SCENEOBJECTS.AddPerspectiveCamera(0, 250, 250); 
            scene.add( mainPerspectiveCamera );


        // -------------------------------------------------------------------------

        // AMBIENT LIGHT
            var ambientLight = SCENEOBJECTS.AddAmbientLight( 0x000000 ); 
            scene.add( ambientLight ); 


        // -------------------------------------------------------------------------

        // POINT LIGHT

            // Define a Point Light 
            var pointLight = SCENEOBJECTS.AddArtificalPointLight(-11, 217, -10);

            // Add in the Point Light into the scene
            scene.add(pointLight); 


            // Define a Point Light Helper
            var pointLightHelper = new THREE.PointLightHelper( pointLight );
            scene.add( pointLightHelper ); 


        // -------------------------------------------------------------------------

        // FUNCTION ROTATION MATRIX AROUND THE X-AXIS: MAKE THE SHAPE TO ALIGN HORIZONTALLY
            export function RotateToHorizontal() {
                var rotX =  new THREE.Matrix4();
                rotX.makeRotationX( (3 * Math.PI) / 2); // Rotate 270 degrees along x-axis 

                return rotX; 
            }


        // -------------------------------------------------------------------------

            // ORBITCONTROLS
            var controls = new OrbitControls(mainPerspectiveCamera, renderer.domElement);
            controls.enableZoom = true; 


        // -------------------------------------------------------------------------

        // FLAT-PLANE TERRAIN SURFACE
            // Make the floor shape
            var flatSurface = FLATSURFACE.AddFlatPlaneSurface(0, 0, 0);

            // Add the floor to the scene!
            scene.add( flatSurface );


        // -------------------------------------------------------------------------

        // LOAD THE DUST (PARTICLE SYSTEM)
            var dustParticles = PARTICLE.CreateDustParticleSystem();
            dustParticles.position.set(0, 20, 0);
            scene.add(dustParticles); 
        

        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------





// -------------------------------------------------------------------------

// GLOBAL MEMEBER VARIABLES

        // -------------------------------------------------------------------------

        // STORE THE TWO KEI-CARS
            export var keiCarOuter;
            export var keiCarInner;


        // -------------------------------------------------------------------------
        
        // VARIABLES FOR STORING EACH POINTS THAT MAKES UP THE PATH IN AN ARR 
            var pointsOnLinePathOuterArr;
            var pointsOnLinePathInnerArr;

        // -------------------------------------------------------------------------

        // ARRAY FOR STORING THE POINTS ON THE PATH OF THE INNER AND OUTER VEHICLE

            var pointsOnPathInnerArr = [];
            var pointsOnPathOuterArr = [];


        // -------------------------------------------------------------------------

        // BOOL VALUES 

            // isAllModelLoaded: Check if all models have been loaded in the scene
            export var isAllModelLoaded = false; 


        // -------------------------------------------------------------------------

        // ARRAY FOR STORING THE LIST OF NAMES FOR DYNAMIC OBJECTS (CAR MODELS, TRACK)
            export var namesDynamicObjectArr = []; 


        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------





// -------------------------------------------------------------------------

// SET-UP THE MECHANICS AND TRACK

        // -------------------------------------------------------------------------

        // GLOBAL VALUES --- CREATE THE TWO LOADERS TO LOAD THE CAR MODELS
            var mtlLoader = new MTLLoader(); 
            var objLoader = new OBJLoader(); 


        // LOAD THE TWO CARS MODELS
            function LoadModel( carModel ) {
                mtlLoader.load('models/moon_van_model.mtl', function(material)
                {
                    material.preload(); 
                    objLoader.setMaterials(material); 
                    objLoader.load('models/moon_van_model.obj', function(object)
                        {
                            // Matrix to scale the model
                            var scaleMatrix = new THREE.Matrix4(); 
                            var scaleValue = 10; // 0.075 
                            scaleMatrix.makeScale(scaleValue, scaleValue, scaleValue);

                            // Local Car Object

                                // Apply the Matrix
                                object.applyMatrix4(scaleMatrix);
                                
                                // Position the model
                                object.position.y = 4;

                                // Make all of the child meshes that make up the mesh
                                // to cast shadows
                                object.traverse( function (child) {
                                    if ( child instanceof THREE.Mesh) {
                                        child.castShadow = true; 
                                    }
                                })

                            // Global Variable of the Car Model

                                // Position the model
                                carModel.position.y = 15;
                                
                                // carModel.model = object; 
                                carModel.add(object); 

                            scene.add( carModel.model ); 
                        }); 
                });
            } 


        // -------------------------------------------------------------------------

        // CREATE AND LOAD THE TWO CAR MODELS
        export function LoadAllModels() {
            keiCarOuter = new THREE.Object3D();
            keiCarOuter.castShadow = true;
            scene.add(keiCarOuter);

            LoadModel( keiCarOuter ); 

            // Add the name of the keiCarOuter model into 
            // list of names of dynamic object
            var keiCarOuterName = "Kei-Car Outer Model";
            keiCarOuter.name = keiCarOuterName;
            namesDynamicObjectArr.push( keiCarOuterName );

            keiCarInner = new THREE.Object3D();
            keiCarInner.castShadow = true; 
            scene.add(keiCarInner);

            LoadModel( keiCarInner );

            // Add the name of the keiCarInner model into 
            // list of names of dynamic object
            var keiCarInnerName = "Kei-Car Inner Model";
            keiCarInner.name = keiCarInnerName;
            namesDynamicObjectArr.push( keiCarInnerName );
        } 



        // -------------------------------------------------------------------------

        // TRIGONOMETRIC CALCULATIONS FOR DRAWING THE TRACKS
        // REFERENCE: https://www.youtube.com/watch?v=JhgBwJn1bQw
        // AND https://stackoverflow.com/questions/52219731/threejs-how-to-draw-shape-with-curved-edges

            // Calculate the outer line markings border for the Outer Car slotholes gap path
            var lineMarkingsBorderOuterCarOuter = TRACK.pathOuterCarMarkingOuter + TRACK.lineMarkingDistance; 
            var lineMarkingsBorderOuterCarInner = TRACK.pathOuterCarMarkingInner - TRACK.lineMarkingDistance; 

            // Calculate the outer line markings border for the Inner Car slotholes gap path
            var lineMarkingsBorderInnerCarOuter = TRACK.pathInnerCarMarkingOuter + TRACK.lineMarkingDistance;
            var lineMarkingsBorderInnerCarInner = TRACK.pathInnerCarMarkingInner - TRACK.lineMarkingDistance; 


        // -------------------------------------------------------------------------

        // CONSTRUCT THE SIMPLE TRACK PIECE!
            export function CreateSimpleTrack() {
                // Base
                TRACK.CreateCircleTrackPiece(TRACK.outerTrackMarkingsRadius, TRACK.innerTrackMarkingsRadius, 2, -5.5, "Base Trackpiece"); 


                // Top-Layer 
                TRACK.CreateCircleTrackPiece(TRACK.outerTrackMarkingsRadius, TRACK.pathOuterCarMarkingOuter, 3.5, -3.5, "Outer Trackpiece"); 
                TRACK.CreateCircleTrackPiece(TRACK.pathOuterCarMarkingInner, TRACK.pathInnerCarMarkingOuter, 3.5, -3.5, "Middle Trackpiece"); 
                TRACK.CreateCircleTrackPiece(TRACK.pathInnerCarMarkingInner, TRACK.innerTrackMarkingsRadius, 3.5, -3.5, "Inner Trackpiece"); 


                // Line-Markings
                TRACK.CreateLineMarkings(lineMarkingsBorderOuterCarOuter, 0, "Line Markings Outer");
                TRACK.CreateLineMarkings(lineMarkingsBorderOuterCarInner, 0, "Line Markings Middle Second");
                TRACK.CreateLineMarkings(lineMarkingsBorderInnerCarOuter, 0, "Line Markings Middle Third");
                TRACK.CreateLineMarkings(lineMarkingsBorderInnerCarInner, 0, "Line Markings Inner");


                // GLOBAL VARIABLES - Store the paths that the outer and inner cars will be travelling in 
                // ALSO: Markings for the movement of the outer and inner vehicles

                // Store each points that makes up the path in an arr
                pointsOnLinePathOuterArr = TRACK.CreatePointsOnPath(TRACK.pathRadiusOuterCar, pointsOnPathOuterArr);
                pointsOnLinePathInnerArr = TRACK.CreatePointsOnPath(TRACK.pathRadiusInnerCar, pointsOnPathInnerArr);
            }
        


        // -------------------------------------------------------------------------

        // FUNCTION FOR ADDING AND REMOVING A PATH LINE 

            export function AddPathLine() {
                TRACK.CreateCarPathLine(pointsOnLinePathOuterArr, "Outer Car Path Line");
                TRACK.CreateCarPathLine(pointsOnLinePathInnerArr, "Inner Car Path Line"); 
            }

            export function RemovePathLine() {
                TRACK.RemoveCarPathLine("Outer Car Path Line");
                TRACK.RemoveCarPathLine("Inner Car Path Line");
            }
 
  
        // -------------------------------------------------------------------------

        // FUNCTIONS FOR ADDING AND REMOVING A BOUNDING BOX

            export function AddBoundingBox(carObj, name) {
                var boundingBox = BOUNDINGBOX.AddBoundingBox(name);
                carObj.add( boundingBox );
            }

            export function RemoveBoundingBox(carObj, name) {
                carObj.remove(BOUNDINGBOX.RemoveBoundingBox(name)); 
            }


        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------





// -------------------------------------------------------------------------

// YUKA -- CAR PHYSICS AND MOVEMENT

        // -------------------------------------------------------------------------

        // YUKA GLOBAL VARIABLES

            // Entity Manager
            var entityManager;

            // Time
            var time; 

            // YUKA Vehicle -- Outer Car
            var keiVehicleOuter = new YUKA.Vehicle();

            // YUKA Vehicle -- Inner Car
            var keiVehicleInner = new YUKA.Vehicle();


        // -------------------------------------------------------------------------

    export function AddCarPhysics() {

        // -------------------------------------------------------------------------

        // Properities for turning off the trasformation of car models meshes in ThreeJS
        // ie The transformations of the car models is to be done in YUKA instead
            keiCarOuter.matrixAutoUpdate = false;
            keiCarInner.matrixAutoUpdate = false;


        // -------------------------------------------------------------------------

        // INITIALISE THE YUKA BEHAVIOUR 

            // Create the YUKA behaviour of the two Car Models and link its mesh object to their behaviour
                // var keiVehicleOuter = new YUKA.Vehicle();
                keiVehicleOuter.setRenderComponent(keiCarOuter, sync); 
                // var keiVehicleInner = new YUKA.Vehicle();
                keiVehicleInner.setRenderComponent(keiCarInner, sync); 


        // -------------------------------------------------------------------------

        // POSITION THE VEHICLE IN RELATIVE TO THE PATH

            // Run the Create Yuka Path function to create a Yuka Path from a set of points
            // and store it into a variable
                var outerCarPath = CARPHYSICS.CreateYukaPath(pointsOnPathOuterArr);
                var innerCarPath = CARPHYSICS.CreateYukaPath(pointsOnPathInnerArr);

            // Position each vehicle to their starting position (
            // first checkpoint) of their path
                keiVehicleOuter.position.copy(outerCarPath.current());
                keiVehicleInner.position.copy(innerCarPath.current());


        // -------------------------------------------------------------------------

        // FUNCTION -- SET-UP THE FOLLOWPATHBEHAVIOUR AND ONPATHBEHAVIOR

            // Run the above methods on both Kei-Cars vehicles
            CARPHYSICS.AddFollowPathBehaviour(outerCarPath, keiVehicleOuter);
            CARPHYSICS.AddFollowPathBehaviour(innerCarPath, keiVehicleInner);


        // -------------------------------------------------------------------------

        // ENTITYMANGER -- HANDLE THE TRANSFORMATIONS AND PHYSICS OF THE TWO CARS
            entityManager = CARPHYSICS.CreateEntityManager(keiVehicleOuter, keiVehicleInner);
        
    

        // -------------------------------------------------------------------------

        // YUKA TIME 
            time = new YUKA.Time(); 

            isAllModelLoaded = true;
    }

        // -------------------------------------------------------------------------

        // Auxillary Function -- Link the mesh object to their YUKA vehicle instance
    
            function sync(entity, renderComponent) {
                renderComponent.matrix.copy(entity.worldMatrix); 
            } 
            

        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------





// -------------------------------------------------------------------------

// GENERATE TRACK AND MODEL

            // -------------------------------------------------------------------------

            // INITIALLY LOAD THE TRACKS, CAR MODELS AND THEIR PHYSICS
                    LoadAllModels();
                    CreateSimpleTrack();
                    AddCarPhysics();

            // -------------------------------------------------------------------------

            // REMOVE ALL THE MODELS AND TRACK PIECES IN THE SCENE
                export function RemoveTrackAndModel() {
                    isAllModelLoaded = false;

                    for (var i = 0; i < namesDynamicObjectArr.length; i++) {
                        var objectToRemove = scene.getObjectByName( namesDynamicObjectArr[i] );
                        scene.remove( objectToRemove );
                    }

                }

            // -------------------------------------------------------------------------


// -------------------------------------------------------------------------





// -------------------------------------------------------------------------

// ANIMATION AND UI CONTROLS

        // -------------------------------------------------------------------------

        // DELTA -- STORE THE TIME BETWEEN THE CURRENT FRAME AND THE LAST FRAME
            var deltaTime; 


        // -------------------------------------------------------------------------

        // RENDER UPDATE LOOP (ANIMATION LOOP)

            var renderUpdateLoop = function() { 
                
                PARTICLE.AnimateParticles(dustParticles);

                if (isAllModelLoaded) {
                    // Variables to keep track of the time for the entityManager
                        var delta = time.update().getDelta();
                        entityManager.update(delta);


                    // Check if the outer car is auto or manual drive
                        if (!UI.isKeiCarOuterAuto) {
                            // When the Kei-Car Outer is Manual Drive 
                            // ie UI.isKeiCarOuterAuto = false; 

                            // Check whether to increase or decrease the speed of the outer kei-car
                            if (UI.isKeiCarOuterButtonHolded) {
                                CARPHYSICS.IncreaseSpeed(CARPHYSICS.keiCarOuterProperities);
                            }
                            else {
                                CARPHYSICS.DecreaseSpeed(CARPHYSICS.keiCarOuterProperities);
                            }
                        }
                        else {
                            // When the Kei-Car Outer is Auto Drive
                            // ie UI.isKeiCarOuterAuto = true

                            // Set the speed of the Outer Kei-Car to operate at a max speed of 25
                            CARPHYSICS.keiCarOuterProperities.speed = 25; 
                        }


                    // Check if the inner car is auto or manual drive
                        if (!UI.isKeiCarInnerAuto) {
                            // When the Kei-Car Inner is Manual Drive 
                            // ie UI.isKeiCarInnerAuto = false; 
                            
                            // Check whether to increase or decrease the speed of the inner kei-car
                            if (UI.isKeiCarInnerButtonHolded) {
                                CARPHYSICS.IncreaseSpeed(CARPHYSICS.keiCarInnerProperities);
                            }
                            else {
                                CARPHYSICS.DecreaseSpeed(CARPHYSICS.keiCarInnerProperities);
                            }

                        }
                        else {
                            // When the Kei-Car Inner is Auto Drive
                            // ie UI.isKeiCarInnerAuto = true

                            // Set the speed of the Outer Kei-Car to operate at a max speed of 25
                            CARPHYSICS.keiCarInnerProperities.speed = 25; 
                        }
   
                    // Adjust the max-speed of each vehicle
                        keiVehicleOuter.maxSpeed = CARPHYSICS.keiCarOuterProperities.speed;
                        keiVehicleInner.maxSpeed = CARPHYSICS.keiCarInnerProperities.speed; 

                    // Check if the Current Speed of both cars equals to zero
                    // If both cars are at zero speed -- then allow the button that has the option to
                    // respawn the track and the car models
                        if (keiCarOuterProperities.speed == 0 && keiCarInnerProperities.speed == 0) 
                        {
                            UI.refreshButton.disabled = false;
                        } 
                        else {
                            UI.refreshButton.disabled = true; 
                        }

                    // Store the current speed of the two vehicles into a global variable
                        document.getElementById("outerCarSpeed").innerHTML = CARPHYSICS.keiCarOuterProperities.speed.toFixed(2);
                        document.getElementById("innerCarSpeed").innerHTML = CARPHYSICS.keiCarInnerProperities.speed.toFixed(2);
                }

                // Re-render the scene
                renderer.render(scene, mainPerspectiveCamera);

                // Update the OrbitControls
                controls.update(); 

                requestAnimationFrame(renderUpdateLoop);
            }; 

           renderUpdateLoop();


        // -------------------------------------------------------------------------


        // RESIZE WINDOWS

            var MyResize = function() {
                var width = window.innerWidth;
                var height = window.innerHeight;
                renderer.setSize(width, height);
                mainPerspectiveCamera.aspect = width/height;
                mainPerspectiveCamera.updateProjectionMatrix();
                renderer.render(scene, mainPerspectiveCamera);
            };

            window.addEventListener('resize', MyResize); 


        // -------------------------------------------------------------------------

        // GUI CONTROLS

            // Create a new GUI Control for testing
            const gui = new GUI( {autoPlace: false, width: 300}); 

            // Link the Dat GUI to HTML and CSS
            gui.domElement.id = 'gui';
            guiBox.appendChild(gui.domElement);

            // GUI Functions to allow to move the pointLight and adjust its intensity
            var folderPointLight = gui.addFolder("Point Light");
            folderPointLight.add(pointLight.position, "y", 0, 500, 1).name("Position in y-axis");
            folderPointLight.add(pointLight, "intensity", 0, 8, 0.2); 
            folderPointLight.add(pointLight, "decay", 1, 2, 0.01);  


        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------



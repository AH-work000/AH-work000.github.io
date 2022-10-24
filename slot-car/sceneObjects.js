// Import all relevant External Three JS Libraries
import * as THREE from '../slot-car/external-js/three.module.js'; 

// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from '../slot-car/main.js';


// -------------------------------------------------------------------------

    // SET-UP THE SCENE

        // -------------------------------------------------------------------------

        // PRESPECTIVE CAMERA
            export function AddPerspectiveCamera(xPos, yPos, zPos) {
                // Define a Camera
                var camera = new THREE.PerspectiveCamera(40, MAIN.ratio, 0.1, 10000);

                // Set Camera Position and Direction 
                camera.position.x = xPos;
                camera.position.y = yPos; 
                camera.position.z = zPos; 
                camera.lookAt(0, 1, 1);

                return camera; 
            }


        // -------------------------------------------------------------------------

        // AMBIENT LIGHT 
            export function AddAmbientLight(color) {
                var ambientLight = new THREE.AmbientLight( color, 1.0 ); // color 
                return ambientLight
            }


        // -------------------------------------------------------------------------

        // POINT LIGHT

            export function AddArtificalPointLight(xPos, yPos, zPos) {
                // Define a Point Light 
                var pointLight = new THREE.PointLight( 0xeedd82, 18, 100); // Artifical Lamp Light Colour
                pointLight.position.set(xPos, yPos, zPos); 

                // Point Light Settings
                pointLight.intensity = 4;
                pointLight.power = 56;
                pointLight.distance = 622;
                pointLight.decay = 1.24;

                // Set Shadow for the Light
                pointLight.castShadow = true;

                return pointLight; 
            }


        // -------------------------------------------------------------------------


// -------------------------------------------------------------------------
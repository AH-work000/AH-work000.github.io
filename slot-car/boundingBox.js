// Import all relevant External Three JS Libraries
import * as THREE from './external-js/three.module.js';

// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from './main.js';

// -------------------------------------------------------------------------

    // -------------------------------------------------------------------------

    // FUNCTION - CREATE A SAMPLE-CUBE TO BE ADDED AS A BOUNDING BOX AROUND THEIR RESPECTIVE CARS
        export function AddBoundingBox(boundingBoxName) {
            var boundingBoxGeometry = new THREE.BoxGeometry(20, 20, 42.5);
            var boundingBoxMaterial = new THREE.MeshBasicMaterial( 
                {
                    color: 0x005500,
                    wireframe: true
                }
            )

            var boundingBox = new THREE.Mesh( boundingBoxGeometry, boundingBoxMaterial);
            boundingBox.position.y = 10; 

            boundingBox.name = boundingBoxName; 

            return boundingBox;
        }

    // -------------------------------------------------------------------------

    // FUNCTION - REMOVE A BOUNDING BOX FROM THE SCENE 
        export function RemoveBoundingBox(name) {
            var boundingBoxToRemove = MAIN.scene.getObjectByName(name);

            return boundingBoxToRemove; 
        }

    // -------------------------------------------------------------------------


// -------------------------------------------------------------------------
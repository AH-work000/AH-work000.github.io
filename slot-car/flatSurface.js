// Import all relevant External Three JS Libraries
import * as THREE from '../slot-car/external-js/three.module.js';

// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from '../slot-car/main.js';

// -------------------------------------------------------------------------

        // -------------------------------------------------------------------------

        // FLAT-PLANE TERRAIN SURFACE

            export function AddFlatPlaneSurface(xPos, yPos, zPos) {
                // Create the geometry for the flat plane surface
                var flatSurfaceGeometry = new THREE.PlaneBufferGeometry(512, 512, 1, 1);

                // Creater the materials for flat plane surface
                var flatSurfaceMaterial = new THREE.MeshPhongMaterial();
                flatSurfaceMaterial.color = new THREE.Color( 0x808080 ); // Trolley Gray
                flatSurfaceMaterial.shininess = 15; 

                // Add the img diffuse map (map) for the wooden floor texture
                var woodenFloorTexture = new THREE.TextureLoader().load('img/wooden-floor.jpg');
                flatSurfaceMaterial.map = woodenFloorTexture; 

                // Add the normal map for the wooden floor texture
                var woodenFloorNormalMap = new THREE.TextureLoader().load('img/wooden-floor-normal.jpg');
                flatSurfaceMaterial.normalMap = woodenFloorNormalMap; 

                // Make the floor shape
                var flatSurface = new THREE.Mesh(flatSurfaceGeometry, flatSurfaceMaterial );
                flatSurface.position.set(xPos, yPos, zPos); 

                // Adjust the rotation of the floor
                flatSurface.applyMatrix4( MAIN.RotateToHorizontal() ); 

                // Position the floor just under the two car models
                flatSurface.position.y = -5.5; 

                // Make the surface to receive some shadow
                flatSurface.receiveShadow = true; 
                
                return flatSurface; 
            }


        // -------------------------------------------------------------------------

// -------------------------------------------------------------------------
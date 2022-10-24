// Import all relevant External Three JS Libraries
import * as THREE from '../slot-car/external-js/three.module.js';

// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from '../slot-car/main.js';


// -------------------------------------------------------------------------

    // CREATE THE SLOT-CAR RACING TRACK 

        // -------------------------------------------------------------------------

        // TRIGONOMETRIC CALCULATIONS FOR DRAWING THE TRACKS
        // REFERENCE: https://www.youtube.com/watch?v=JhgBwJn1bQw
        // AND https://stackoverflow.com/questions/52219731/threejs-how-to-draw-shape-with-curved-edges
            
            // trackRadius: Distance from centre of the circle to the line markings at the middle of the track
            export var trackRadius = 167.5; 

            // trackWidth: The width of the track 
            export var trackWidth = 70; 

            // slotholeWidth: The width of the slot hole path in the track for each of the two cars
            export var slotholeWidth = 3.5; 

            // pathRadiusOuterCar: Distance from centre of the circle path of the Outer Car 
            export var pathRadiusOuterCar = 180; 

            // pathRadiusInnerCar: Distance from centre of the circle path of the Inner Car 
            export var pathRadiusInnerCar = 150; 

            // lineMarkingWidth: Distance of the line markings from their respective slotholes path
            export var lineMarkingDistance  = 3.5; 

            // Calculate the innerTrackMarkingsRadius and outerTrackMarkingsRadius
            export var innerTrackMarkingsRadius = trackRadius - (trackWidth / 2);
            export var outerTrackMarkingsRadius = trackRadius + (trackWidth / 2); 

            // Calculate the markings for the slotholes gap for the Outer Car 
            export var pathOuterCarMarkingOuter = pathRadiusOuterCar + (slotholeWidth / 2);
            export var pathOuterCarMarkingInner = pathRadiusOuterCar - (slotholeWidth / 2);

            // Calculate the markings for the slotholes gap for the Inner Car 
            export var pathInnerCarMarkingOuter = pathRadiusInnerCar + (slotholeWidth / 2);
            export var pathInnerCarMarkingInner = pathRadiusInnerCar - (slotholeWidth / 2);


        // -------------------------------------------------------------------------

        // FUNCTION FOR CREATING THE CIRCLE TRACK PIECES THAT MAKE UP THE SIMPLE TRACK
        // REFERENCE: https://stackoverflow.com/questions/28532878/three-js-punch-hole-in-shape-with-another-shape

            export function CreateCircleTrackPiece(outerRingRadius, innerRingRadius, height, yPos, trackPieceName) { 
                // Create the entire shape of the simple track (circular ring)
                var trackCirclePoints = CreateCircleLinePoints( outerRingRadius) ;
                var trackCircle = new THREE.Shape( trackCirclePoints );
            
                // Create the inner hole of the simple track
                var trackCircleHolePoints = CreateCircleLinePoints( innerRingRadius ); 
                var trackCircleHole = new THREE.Shape( trackCircleHolePoints ); 
            
                // Punch out a hole to the shape of the trackCircleHole from the trackCircle
                trackCircle.holes.push( trackCircleHole ); 
            
                // Add in the settings for the extrusion of the circle markings
                // Total Hieght (Depth): 4.5
                var extrudeSettings = {
                    bevelEnabled: false, 
                    depth: height
                }
            
                // Define the geometry and material of the track piece
                var trackGeometry = new THREE.ExtrudeGeometry(trackCircle, extrudeSettings); 
                var trackMaterial = new THREE.MeshPhongMaterial( { color: 0x161616 }); 

                // Assemble the geometry and material together into a track piece
                var track = new THREE.Mesh( trackGeometry, trackMaterial );
                track.applyMatrix4( MAIN.RotateToHorizontal() );

                // Assign the position of the track piece on the y-axis
                track.position.y = yPos; 

                // Make each circle track piece to both receive and cast shadow
                track.castShadow = true;
                track.receiveShadow = true;

                // Add the name of each track piece to the 
                // list of names of dynamic object
                track.name = trackPieceName;
                MAIN.namesDynamicObjectArr.push( trackPieceName );

                // Add the piece to the scene
                MAIN.scene.add( track ); 
            }


        // -------------------------------------------------------------------------

        // FUNCTION FOR CREATING THE LINE MARKINGS IN THE SIMPLE TRACK
        // REFERENCE: https://stackoverflow.com/questions/65435642/my-three-js-line-geometry-is-not-showing-on-screen

            export function CreateLineMarkings(lineMarkingsRadius, yPos, lineMarkingsName) {

                // Put the above points representation into a buffer geometry
                var lineMarkingsPoints = CreateCircleLinePoints( lineMarkingsRadius ); 
                var lineMarkingsGeometry = new THREE.BufferGeometry().setFromPoints( lineMarkingsPoints );
                
                // Create the material for the line
                var lineMarkingsMaterial = new THREE.LineBasicMaterial( {
                    color: 0xffffff,
                    linewidth: 10,
                })

                // Assemble the Line Markings Shape
                var lineMarkings = new THREE.Line( lineMarkingsGeometry, lineMarkingsMaterial );
                lineMarkings.applyMatrix4(  MAIN.RotateToHorizontal() );

                // Assign the position of the line markings on the y-axis
                lineMarkings.position.y = yPos; 

                // Add the name of each line markings to the 
                // list of names of dynamic object
                lineMarkings.name = lineMarkingsName;
                MAIN.namesDynamicObjectArr.push( lineMarkingsName );

                // Add the line marking to the scene
                MAIN.scene.add( lineMarkings ); 
            }


        // -------------------------------------------------------------------------

        // FUNCTION -- CREATE A CIRCLE GEOMETRY AS A CIRCLE LINE

            export function CreateCircleLinePoints(radius) {
                    // Create a new path variable to represent the line markings
                    var lineMarkingsPath = new THREE.Path(); 

                    // Draw out the circle shape (ring) of the line markings
                    lineMarkingsPath.absarc(0, 0, radius, 0, Math.PI * 2, false); 
                
                    // Convert the line markings path reprersentation into points
                    var lineMarkingsPoints = lineMarkingsPath.getPoints(180); 

                    return lineMarkingsPoints; 
            }


        // -------------------------------------------------------------------------

        // FUNCTION -- CREATE THE POINTS OF THE CIRCULAR PATH THAT THE CARS WILL FOLLOW
        // FUNCTION PARTLY ADAPTED FROM JONIVESTO: https://blog.jonivesto.com/three-js-draw-a-circle/

            // --- CODE TO BE FURTHER REFINED HERE! --- 
            export function CreatePointsOnPath(radius, pointsOnCarPathArr) {
                // Create a circular path function -- to be returned as a path
                var circularPath = new THREE.Path(); 
                circularPath.absarc(0, 0, radius, 0, Math.PI * 2, false); 
                circularPath.getSpacedPoints(360); 

                // Create an arr to the store the points that will be displayed in the line path
                var pointsOnLinePathArr = []; 

                // Add in the points around the circular path that the cars will follow
                for (var i = 0; i <= 360; i++) {
                    // Each points on the circular path is inputted using trigonometry
                    // First Param: Find the Opposite (where point is relative to the x-axis)
                    // Second Param: None (Nothing in the Y-axis because this is a 2D path in a 3D world!)
                    // Third Param: Find the Adjacent (where point is relative to the z-axis)
                    pointsOnLinePathArr.push(new THREE.Vector3(Math.sin(i * (Math.PI/180)) * radius, 0, Math.cos( i * (Math.PI/180)) * radius));
                    pointsOnCarPathArr.push(Math.sin(i * (Math.PI/180)) * radius, 0, Math.cos( i * (Math.PI/180)) * radius); 
                }

                return pointsOnLinePathArr; 
            }


        // -------------------------------------------------------------------------

        // FUNCTION -- CREATE A LINE THAT REPRESENTS THE PATH THAT EACH CAR WILL TRAVEL BASED ON THE POINTS
        // STORED IN AN ARRAY

            export function CreateCarPathLine( pointsOnPathArr, pathName ) {
                // Convert those points into a geometry
                var circularPathLineGeometry = new THREE.BufferGeometry().setFromPoints( pointsOnPathArr );

                // Create the material for the circular path line
                var lineMarkingsMaterial = new THREE.LineBasicMaterial( {
                    color: 0xbcbcbc,
                    linewidth: 10,
                })

                // Assemble the circular path line geometry and its material together
                var carPathLine  = new THREE.Line( circularPathLineGeometry, lineMarkingsMaterial);


                // Assign the position of the Car Path on the y-axis
                carPathLine.position.y = 12; 

                carPathLine.name = pathName;

                // Add the Car Path Line to the scene
                MAIN.scene.add( carPathLine );

            }


        // -------------------------------------------------------------------------

        // FUNCTION -- REMOVE THE LINE OF THE CIRCULAR PATH THAT THE CARS WILL FOLLOW

            export function RemoveCarPathLine(pathName) {
                var carPathLineToBeRemoved = MAIN.scene.getObjectByName(pathName);
                MAIN.scene.remove(carPathLineToBeRemoved); 
            }
        

        // -------------------------------------------------------------------------


// -------------------------------------------------------------------------
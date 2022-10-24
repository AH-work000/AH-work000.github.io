// Import all relevant External Three JS Libraries
import * as YUKA from '../slot-car/external-js/yuka.module.js'; 



// -------------------------------------------------------------------------

// YUKA -- CAR PHYSICS AND MOVEMENT


     // -------------------------------------------------------------------------

     // FUNCTION -- CREATE A NEW YUKA PATH
            export function CreateYukaPath(pointsOnCarPathArr) {
                var carPath = new YUKA.Path();

                for (var i = 0; i < pointsOnCarPathArr.length; i += 3) {
                    carPath.add( new YUKA.Vector3( pointsOnCarPathArr[i], 0, pointsOnCarPathArr[i+2] ) ); 
                }

                carPath.loop = true; 

                return carPath;
            }


    // -------------------------------------------------------------------------

    // FUNCTION -- SET-UP THE FOLLOWPATHBEHAVIOUR AND ONPATHBEHAVIOR
        export function AddFollowPathBehaviour(path, vehicle) {
            var followPathBehaviour = new YUKA.FollowPathBehavior(path, 0.5); 
            vehicle.steering.add(followPathBehaviour); 
            // var onPathBehavior = new YUKA.OnPathBehavior(path);
            // vehicle.steering.add(onPathBehavior);
        } 


    // -------------------------------------------------------------------------

    // ENTITYMANGER -- HANDLE THE TRANSFORMATIONS AND PHYSICS OF THE TWO CARS
        export function CreateEntityManager(vehicle1, vehicle2) {
            var entityManager = new YUKA.EntityManager();
            entityManager.add(vehicle1);
            entityManager.add(vehicle2);
            return entityManager; 
        }


    // -------------------------------------------------------------------------

    // VARIABLES TO STORE THE SPEED OF THE KEI-CARS
        export var keiCarOuterProperities = {
            speed: 0.00
        }

        export var keiCarInnerProperities = {
            speed: 0.00
        }

    
    // -------------------------------------------------------------------------

    // FUNCTION: INCREASE THE MAXSPEED OF THE KEI-CARS
        export function IncreaseSpeed(carProperities) {
            /*
            if (carProperities.speed < 60) {
                carProperities.speed += 1; 
            } 
            */

           if (carProperities.speed < 10) {
                carProperities.speed += 0.5; 
            } 

            if (carProperities.speed < 40 && carProperities.speed >= 10) {
                carProperities.speed += 1;
            }
        }



    // -------------------------------------------------------------------------

    // FUNCTION: DECREASE THE MAXSPEED OF THE KEI-CARS
    
        export function DecreaseSpeed(carProperities) {
            /*
            if (carProperities.speed > 60) {
                carProperities.speed -= 1; 
            }
            */
            

            if (carProperities.speed <= 42 && carProperities.speed > 10) {
                carProperities.speed -= 1;
            }

            if (carProperities.speed <= 10 && carProperities.speed > 0) {
                carProperities.speed -= 0.5; 
            } 

        }

// -------------------------------------------------------------------------
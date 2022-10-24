// Import all relevant External Three JS Libraries
import * as THREE from '../slot-car/external-js/three.module.js';

// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from '../slot-car/main.js';


// Code partly inspired by Greg Stier
// Link: https://solutiondesign.com/insights/webgl-and-three-js-particles/


// -------------------------------------------------------------------------

   // SMOKE-PARTICLE SYSTEM

        // -------------------------------------------------------------------------

        // SUPPLEMENTARY FUNCTION --- GETTING A RANDOM INT

            // Based on the example provided by Borislav Hadzhiev: 
            // https://bobbyhadz.com/blog/javascript-get-random-float-in-range

            function getRandomInt(inclusiveMin, inclusiveMax) {
                return Math.floor(Math.random() * (inclusiveMax - inclusiveMin + 1 ) ) + inclusiveMin;
            }


        // -------------------------------------------------------------------------

        export function CreateDustParticleSystem() {

            // Particle Geometry
            var particleAmount = 250;
            var particleGroup = new THREE.BufferGeometry();
            var particlesArr = [];

            for (var i = 0; i < particleAmount; i++) {

                // Create Random Position for each particle
                var x = getRandomInt(-256, 256); 
                var y = getRandomInt(0, 200);
                var z = getRandomInt(-256, 256); 

                var particle = new THREE.Vector3(x, y, z);
                particlesArr.push(particle);

                // particleGroup.vertices.push(particle);
            }

            particleGroup.setFromPoints(particlesArr);


            // Particle Material
            var particleMaterial = new THREE.PointsMaterial({
                color: 0xfffafa,
                size: 1,
                map: THREE.ImageUtils.loadTexture("img/dust-particle.jpg"),
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            // Combine the Geometry and Material together to create the particle system
            var dustParticleSystem = new THREE.Points(particleGroup, particleMaterial);

            return dustParticleSystem;
        }

      
        // -------------------------------------------------------------------------

        export function AnimateParticles(particleSystem) {
            var point = particleSystem.geometry.attributes.position.array;
            for (var i = 0; i < 2500; i += 3) {

                console.log("position-y: " + point[i+1]);

                // If the point is at or lower than the ground
                // respawn the particle at a higher position
                if (point[i+1] < -5) {
                    point[i+1] = getRandomInt(0, 120);
                }

                point[i+1] -= 0.25; 
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }


// -------------------------------------------------------------------------
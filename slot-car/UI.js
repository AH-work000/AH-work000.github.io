// Import all relevant Internal (Auxillary) Three JS Modules
import * as MAIN from '../slot-car/main.js';

// -------------------------------------------------------------------------

// ANIMATION AND UI CONTROLS

    // -------------------------------------------------------------------------

        // BOOL VALUES 

            // isKeiCarOuterButtonHolded: Check If the Button for the Outer Car has been hold down
            export var isKeiCarOuterButtonHolded = false;

            // isKeiCarInnerButtonHolded: Check If the Button for the Inner Car has been hold down
            export var isKeiCarInnerButtonHolded = false;

            // isKeiCarOuterAuto: Check If the Switch for making the Outer Car drive automatic is on
            export var isKeiCarOuterAuto = false;

            // isKeiCarInnerAuto: Check If the Switch for making the Inner Car drive automnatic is on
            export var isKeiCarInnerAuto = false; 


    // -------------------------------------------------------------------------

    // GLOBAL VARIABLES -- STORE THE REFERENCES TO THE HTML/CSS UI INPUS

        // Kei-Car Buttons
            var keiCarOuterButton = document.getElementById("buttonOuterKeiCar");
            var keiCarInnerButton = document.getElementById("buttonInnerKeiCar");

        // Toy Control Configuration Panel
            var toyControlColl = document.getElementsByClassName("toyControlCollapsible");

        // Generate Track and Model Button
            export var refreshButton = document.getElementById("refreshButton");
            

    // -------------------------------------------------------------------------

    // EVENTLISTENERS 

        // -------------------------------------------------------------------------

        // Buttons
            keiCarOuterButton.addEventListener("mousedown", function() {
                isKeiCarOuterButtonHolded = true;
            }); 

            keiCarOuterButton.addEventListener("mouseup", function() {
                isKeiCarOuterButtonHolded = false;
            }); 

            keiCarInnerButton.addEventListener("mousedown", function() {
                isKeiCarInnerButtonHolded = true;
            }); 

            keiCarInnerButton.addEventListener("mouseup", function() {
                isKeiCarInnerButtonHolded = false;
            }); 


        // -------------------------------------------------------------------------

        // Kei-Car Automatic Switches
        // Code Idea Partly Inspired by PeterMader Solution:
        // https://stackoverflow.com/questions/44565816/javascript-toggle-switch-using-data
    
            document.addEventListener('DOMContentLoaded', function() {
            var keiCarOuterCheckboxSlider = document.querySelector('input[id = "checkBoxSlideOuterKeiCar"]');

                keiCarOuterCheckboxSlider.addEventListener('change', function () {
                        if(keiCarOuterCheckboxSlider.checked) {
                            isKeiCarOuterAuto = true; 
                        }
                        else {
                            isKeiCarOuterAuto = false; 
                        }
                });

            });


            document.addEventListener('DOMContentLoaded', function() {
            var keiCarInnerCheckboxSlider = document.querySelector('input[id = "checkBoxSlideInnerKeiCar"]');

                keiCarInnerCheckboxSlider.addEventListener('change', function () {
                        if(keiCarInnerCheckboxSlider.checked) {
                            isKeiCarInnerAuto = true;
                        }
                        else {
                            isKeiCarInnerAuto = false; 
                        }
                });
                    
            });


        // -------------------------------------------------------------------------
        
        // Bounding Box Checkbox 
            
            document.addEventListener('DOMContentLoaded', function() {
            var boundingBoxOuterCarCheckbox = document.querySelector('input[id = boundingBoxOuterCarCheckbox]');

                    boundingBoxOuterCarCheckbox.addEventListener('change', function() {
                        if (boundingBoxOuterCarCheckbox.checked) {
                            MAIN.AddBoundingBox(MAIN.keiCarOuter, "Bounding Box Outer Car"); 
                        }
                        else {
                            MAIN.RemoveBoundingBox(MAIN.keiCarOuter, "Bounding Box Outer Car"); 
                        }
                })
            })

            document.addEventListener('DOMContentLoaded', function() {
                var boundingBoxInnerCarCheckbox = document.querySelector('input[id = boundingBoxInnerCarCheckbox]');
    
                    boundingBoxInnerCarCheckbox.addEventListener('change', function() {
                        if (boundingBoxInnerCarCheckbox.checked) {
                            MAIN.AddBoundingBox(MAIN.keiCarInner, "Bounding Box Inner Car"); 
                        }
                        else {
                            MAIN.RemoveBoundingBox(MAIN.keiCarInner, "Bounding Box Inner Car"); 
                        }
                })
            })


        // -------------------------------------------------------------------------
        
        // Path Line Checkbox 
            
            document.addEventListener('DOMContentLoaded', function() {
                var pathLineCheckbox = document.querySelector('input[id = pathLineCheckbox]');

                pathLineCheckbox.addEventListener('change', function() {
                        if (pathLineCheckbox.checked) {
                            MAIN.AddPathLine();
                        }
                        else {
                            MAIN.RemovePathLine();
                        }
                })
            })


        // -------------------------------------------------------------------------

        // Toy Control Configuration Panel

            for (var i = 0; i < toyControlColl.length; i++) {
                toyControlColl[i].addEventListener("click", function() {
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

        // Generate Track and Model Button

            refreshButton.addEventListener("click", function() {
                MAIN.RemoveTrackAndModel();
                MAIN.LoadAllModels();
                MAIN.CreateSimpleTrack();
                MAIN.AddCarPhysics();
            })


        // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------

// -------------------------------------------------------------------------



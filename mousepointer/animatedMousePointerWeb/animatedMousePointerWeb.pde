// Simple Fire Particle Curl Animated Mouse
// Some Inspo from Dan Shiffman (Coding Train Guy): https://processing.org/examples/simpleparticlesystem.html

// MEMBER VARIABLES

  // Stores the list of all of the fire particles in the scene currently
  ArrayList<FireParticle> particles = new ArrayList<FireParticle>();
  
  // Number of Fire Particles to add into the scene for each frame
  float numberOfParticlesToAdd= 3;
  
  // The maximum amount of fire particles that is in the scene
  float numberOfFireParticles = 30;
  
  // Scale (proportional) size of each particle quad shape
  // Corresponds to scaleVal member variable in the FireParticle class
  float scale = 1;
  
  // The colour of each fire particle
  float redness = random(64, 192);
  float greeness = 0;
  float blueness = 0;
  
  
// PUBLIC MEMBER VARIABLES

  // Setup the sketch document 
  void setup() {
    size(1200, 550);
    background(255);
  }
  
  // Update the fire particles each turn
  void draw() {
    // Determine the background colour
     background(255);
    
    // Create new fire particles only if the number of fire particles in the curl
    // is less than its maximum limit
     if (particles.size() <= numberOfFireParticles) {
          for (int i = 0; i < numberOfParticlesToAdd; i++) {
            particles.add(new FireParticle(0, 0, scale, redness, greeness, blueness));
         }
     }
    
     // Update each fire particles in the array (ie currently in the sketch window)
     translate(mouseX, mouseY);
     for (int i = 0; i < particles.size(); i++) {
       particles.get(i).update();
       if (particles.get(i).isDead()) {
           particles.remove(i);
       }
     }
  }
  
  // Reset to default configuration with mouse click
  void mouseClicked() {
      numberOfFireParticles = 100;
      scale = 0.8;
  }
  
  
  // Slowly increase the size (minimum and maximum offset) of each subsequent fireParticle
  // added to the scene
  void mouseDragged() {
      if (scale <= 3.0) {
          scale += 0.002; 
      }
  }
  
  
  // Gradually increment the number of particles in the scene to 800 particles
  void mouseMoved() {
    if (numberOfFireParticles < 800) {
      numberOfFireParticles++;
    }
  }
  
  
  // Press the 'r", 'g', 'b', 'y' or 'p' keys to change the colour of the fire particles
  void keyPressed() {
    char currentKey = key;
    
    switch(currentKey) {
      case 'r': changeParticleColour("Red"); break;
      case 'g': changeParticleColour("Green"); break;
      case 'b': changeParticleColour("Blue"); break;
      case 'p': changeParticleColour("Purple"); break;
      case 'o': changeParticleColour("Orange"); break;
      case 't': changeParticleColour("Turquoise"); break;
    }
  }
  
  // Methods for changing the colour of the fire particles via rgb channels
  void changeParticleColour(String colour) {
    if (colour == "Red") {
        redness = random(64, 192);
        greeness = 0;
        blueness = 0;
    }
    
    if (colour == "Green") {
        redness = 0;
        greeness = random(64, 192);
        blueness = 0;
    }
    
    if (colour == "Blue") {
        redness = 0;
        greeness = 0;
        blueness = random(64, 192);
    }
    
    if (colour == "Purple") {
      redness = random(64, 192);
      greeness = 0;
      blueness = random(64, 192);
    }
    
     if (colour == "Orange") {
      redness = 255;
      greeness = random(64, 192);
      blueness = 0;
    }
    
    if (colour == "Turquoise") {
      redness = 0;
      greeness = 255;
      blueness = random(64, 192);
    }

 }
 
 
 // Class for Fire Particles in the animated moust pointer
 class FireParticle {
  // MEMBER VARIABLES 
  
    // Position of each fire particle 
    float xPos;
    float yPos;
    
    // The minimum and maximum offset to determine the position of each vertices
    // of the quad (ie its size)
    int minimumOffset = 1;
    int maximumOffset = 5;
    
    // Scale (proportional) size of each particle quad shape
    float scaleVal; 
    
    // Determine the height and width of the quad shape for the fire particle
    float quadHeight = random(minimumOffset, minimumOffset);
    float quadWidth = random(maximumOffset, maximumOffset);
    
    // The rotation speed of each fire particle 
    float spinner = 0;
    
    // The colour of each fire particle
    float redness = 0;
    float greeness = 0;
    float blueness = 0;
    
    // The opacity (alpha) of each fire particle
    float opacity = random(128, 255);
    
    // The movement speed of each fire particle (it has no direction and its mapped to the minimum and maxmium offset)
    float speedX = random(minimumOffset * 0.25, maximumOffset * 0.25);
    float speedY = random(minimumOffset * 0.25, maximumOffset * 0.25);
    
    // The amount of time that the fire particle is 'alive' (in the scene)
    // It lifeSpand is decremented until it is 0, which it will be dead and is removed from the scene. 
    float lifeSpan = opacity;
    
  // METHODS 

    // Constructor
    FireParticle(float xPos, float yPos, float scale, float redness, float greeness, float blueness) {
      this.xPos = xPos;
      this.yPos = yPos;
      scaleVal = scale;
      this.redness = redness;
      this.greeness = greeness;
      this.blueness = blueness;
    }
    
    // Update each fire particle each frame
    void update() {
      updateCurrentStatus();
      rePositionParticle();
    }
    
    // Update the positioning, lifespan, rotation and colour of each fire particle
    void updateCurrentStatus() {
      xPos += speedX;
      yPos += speedY;
      lifeSpan--; 
      opacity--;
      spinner++;
    }
    
    // Update the positioning, lifespan, rotation and colour of each fire particle
    void rePositionParticle() {
      pushMatrix();
      noStroke();
      rotate(spinner * 0.01);
      // scale(scaleVal);
      fill(redness, greeness, blueness, opacity);
      rectMode(CENTER);
      quad(xPos, yPos, xPos + quadWidth, yPos - quadHeight, xPos + quadWidth, yPos + quadHeight, xPos, yPos + quadHeight);
      popMatrix();
    }
    
    // Check if the fire particle has a lifeSpan value of 0; meaning that it is considered dead
    boolean isDead() {
      return lifeSpan <= 0;
    }
 
}

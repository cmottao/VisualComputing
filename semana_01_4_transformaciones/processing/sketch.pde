// 3D Transformations in Processing
// A cube that rotates, translates in a wavy pattern, and scales cyclically over time

void setup() {
  size(1280, 770, P3D);
  pixelDensity(1);
  smooth(8);
}

void draw() {
  background(30, 30, 45);
  lights();
  
  float t = millis() / 1000.0; // time in seconds

  // ---------- Main cube (rotation + wavy translation + cyclic scaling) ----------
  pushMatrix();
    // Center on screen
    translate(width / 2, height / 2, 0);
    
    // Wavy translation using sin/cos
    float waveX = sin(t * 1.2) * 150;
    float waveY = cos(t * 0.8) * 60;
    float waveZ = sin(t * 0.5) * 80;
    translate(waveX, waveY, waveZ);
    
    // Continuous rotation on all 3 axes
    rotateX(t * 0.7);
    rotateY(t * 1.0);
    rotateZ(t * 0.4);
    
    // Cyclic scaling with sin()
    float s = 1.0 + 0.35 * sin(t * 2.0);
    scale(s);
    
    // Draw the cube
    fill(70, 160, 255);
    stroke(255);
    strokeWeight(2);
    box(80);
  popMatrix();

  // ---------- Orbiting sphere ----------
  pushMatrix();
    translate(width / 2, height / 2, 0);
    rotateY(t * 1.5);
    translate(200, 0, 0);
    
    float sSphere = 0.8 + 0.3 * sin(t * 3.0);
    scale(sSphere);
    
    fill(255, 120, 60);
    noStroke();
    sphere(25);
  popMatrix();

  // ---------- Second cube (opposite orbit) ----------
  pushMatrix();
    translate(width / 2, height / 2, 0);
    rotateY(-t * 1.0);
    rotateX(t * 0.5);
    translate(160, 0, 0);
    
    rotateX(t * 2.0);
    rotateZ(t * 1.5);
    
    float s2 = 0.7 + 0.25 * cos(t * 2.5);
    scale(s2);
    
    fill(100, 255, 140);
    stroke(255);
    strokeWeight(1.5);
    box(40);
  popMatrix();
}

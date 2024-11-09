let rings = [];
let numRing = 5;
let canvas;

let previousLipDistance;
//ml5.js

let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let startBtn;

function preload() {
  // Load the handPose model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  canvas = createCanvas(640, 480);
  //Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  startBtn = createButton("Restart");
  canvas.parent("container");
  startBtn.parent("container");
  startBtn.position(width/2 - 50, 50);
  startBtn.class("sBtn");

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  for (let i = 0; i < numRing; i++) {
    rings[i] = [];
    let r = 30 + i * 15;
    let circumference = 2 * PI * r;
    let fontSize = 15 + i * 3;
    let num = floor(circumference / fontSize);

    for (let j = 0; j < num; j++) {
      let angle = (TWO_PI / num) * j;
      let x = width / 2 + r * Math.cos(angle);
      let y = height / 2 + r * Math.sin(angle);
      let hue = 360 / i + 60;

      let color = `hsl(${hue}, 100%, 50%)`;
      rings[i][j] = new Letter(x, y, fontSize, color);
    }
  }
}

function draw() {
  background(0);
  image(video, 0, 0);

  startBtn.mouseClicked(refresh);

  if (faces.length > 0 && faces[0].lips) {
    let topLeftLip = createVector(faces[0].lips.x, faces[0].lips.y);
    let bottomRightLip = createVector(
      faces[0].lips.x + faces[0].lips.width,
      faces[0].lips.y + faces[0].lips.height
    );
    let centerLip = createVector(faces[0].lips.centerX, faces[0].lips.centerY);
    stroke(0, 255, 0);
    noFill();
    // ellipse(topLeftLip.x, topLeftLip.y, 10, 10);
    // ellipse(bottomRightLip.x, bottomRightLip.y, 10, 10);
    // ellipse(centerLip.x, centerLip.y, 10, 10);

    let lipDistance = dist(
      topLeftLip.x,
      topLeftLip.y,
      bottomRightLip.x,
      bottomRightLip.y
    );
    if (previousLipDistance > 70 && previousLipDistance - lipDistance > 5) {
      for (let i = 0; i < rings.length; i++) {
        for (let j = 0; j < rings[i].length; j++) {
          let mouth = createVector(centerLip.x, centerLip.y);
          trigger(rings[i][j], mouth);
        }
      }
    }
    previousLipDistance = lipDistance;

    //console.log(previousLipDistance);
  }

  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j < rings[i].length; j++) {
      rings[i][j].update();
      rings[i][j].draw();
    }
  }

  // drawPartsKeypoints();
}

// Draw keypoints for specific face element positions
function drawPartsKeypoints() {
  // If there is at least one face
  if (faces.length > 0) {
    for (let i = 0; i < faces[0].lips.keypoints.length; i++) {
      let lips = faces[0].lips.keypoints[i];
      fill(0, 255, 0);
      circle(lips.x, lips.y, 5);
    }
  }
}
// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function trigger(letter, mouth) {
  let force = p5.Vector.sub(letter.pos, mouth);
  let distance = force.mag();
  force.normalize();

  let magnitude = map(distance, 0, width, 0.1, 1) * random(0.1, 1);
  force.mult(magnitude);
  letter.applyForce(force);
  letter.angleV = map(distance, 0, width, 0.01, 0.1) * random(0.5, 6);
}
function refresh() {
  console.log("refresh");
  location.reload();
}
function windowResized() {
  resizeCanvas(400, 400);
}

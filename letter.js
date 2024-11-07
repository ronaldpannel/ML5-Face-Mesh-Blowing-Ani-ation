class Letter {
  constructor(x, y, fontSize, color) {
    this.fontSize = fontSize;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = createVector(0, 0);
    this.sentence = [
      "r",
      "o",
      "s",
      "i",
      "e",
      "c",
      "o",
      "n",
      "n",
      "i",
      "e",
      "r",
      "a",
      "l",
      "p",
      "h",
    ];
    this.letter = random(this.sentence);
    this.angle = 0;
    this.angleV = 0;
    this.r;
    this.g;
    this.b;
    this.color = color;
  }
  applyForce(force) {
    this.acc.add(force);
  }
  update() {
    this.angle += this.angleV;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
  }
  draw() {
    push();
    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    text(this.letter, 0, 0);
    pop();
    fill(this.color);
  }
}

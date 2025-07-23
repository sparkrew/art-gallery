class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isLetter = false;
    this.angle = 0;
    this.depth = 0;
  }

  display() {
    stroke(255, 100);
    noFill();
    if (this.isLetter == true) {
      stroke(255);
      this.depth += 1;
      this.angle += 1;
    } else {
      this.angle -= 1;
    }

    push();
    translate(this.x, this.y, this.depth);
    rotateX(this.angle);
    rotateZ(this.angle);
    box(size - (1 / 3) * size);
    pop();
  }
}

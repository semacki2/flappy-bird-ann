class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 64;
    this.r = 16;

    this.gravity = 0.7;
    this.lift = -12;
    this.velocity = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 24, 2);
    }

    this.score = 0;
    this.fitness = 0;

  }

  show() {
    stroke(255);
    fill(255, 50);
    ellipse(this.x, this.y, this.r * 2);

  }

  think(pipes) {

    let closestPipe = null;
    let closestDist = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let newDist = (pipes[i].x + pipes[i].w) - this.x;
      if (newDist < closestDist && newDist > 0) {
        closestDist = newDist;
        closestPipe = pipes[i];
      }
    }

    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closestPipe.top / height;
    inputs[2] = closestPipe.bottom / height;
    inputs[3] = closestPipe.x / width;
    inputs[4] = this.velocity / 10;


    let outputs = this.brain.predict(inputs);
    if (outputs[0] > outputs[1]) {
      this.up();
    }
  }

  update() {
    this.score++;


    this.velocity += this.gravity;
    this.y += this.velocity;
    //this.velocity *= 0.9;

    if (this.y > height - this.r) {
      this.y = height - this.r;
      this.velocity = 0;
    }

    if (this.y < this.r) {
      this.y = this.r;
      this.velocity = 0;
    }
  }

  up() {
    this.velocity += this.lift;
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  isOffScreen() {
    if (this.y - this.r <= 0 || this.y + this.r >= height) {
      return true;
    } else {
      return false;
    }
  }
}
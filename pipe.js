class Pipe {
  constructor(pipeSpeed) {
    this.spacing = 100;
    this.top = random(height / 6, (0.75) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 80;
    this.speed = pipeSpeed;
    this.highlight = false;
  }

  show() {
    if (this.highlight) {
      fill(255, 0, 0);

    } else {
      fill(0, 255, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  isOffScreen() {
    if (this.x < -this.w + this.speed) {
      return true;
    } else {
      return false;
    }
  }

  hits(bird) {
    if (bird.y - bird.r < this.top || bird.y + bird.r > height - this.bottom) {
      if (bird.x + bird.r > this.x && bird.x + bird.r < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
}
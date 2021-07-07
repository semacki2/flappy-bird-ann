function nextGeneration() {
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = pickOne();
  }
  savedBirds = [];
}


function calculateFitness() {
  //normalized fitness relative to the population
  let sum = 0;
  for (let bird of savedBirds) {
    sum += pow(bird.score, 2);
  }

  for (let bird of savedBirds) {
    bird.fitness = pow(bird.score,2) / sum;
  }
}

function pickOne() {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r -= savedBirds[index].fitness;
    index++;
  }
  index--;

  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();
  return child;
}
const TOTAL = 10;

var birds = [];
var savedBirds = [];
var pipes = [];

let pipeStartingSpeed = 5;
let pipeSpeed = pipeStartingSpeed;

let brain;

var counter = 0;
let slider;
let pSliderSpeed;

let genCount = 0;
let recordScore = 0;

let pGenCount, pCurrentScore, pRecordScore, pPopSize, pPipeSpeed;

let btnSaveBestBird;
let bestBirdBrain;

function setup() {
  createCanvas(800, 400);
  pSliderSpeed = createP("Speed: 1");
  slider = createSlider(1, 100, 1);

  pGenCount = createP("Generation #" + genCount);
  pPopSize = createP("Current Population Size: 1000");
  pCurrentScore = createP("Current Score: " + 0);
  pRecordScore = createP("Record Score: " + recordScore);
  pPipeSpeed = createP("Pipe Speed: 5");
  createP('');

  btnSaveBestBird = createButton('Save best bird');
  btnSaveBestBird.mousePressed(saveBestBird);

  for (let i = 0; i < TOTAL; i++) {
    birds.push(new Bird());
  }

}

function draw() {

  for (let n = 0; n < slider.value(); n++) {
    if (counter >= (width / (pipeSpeed)) - 10 || counter == 0 || pipes.length < 1) {
      pipes.push(new Pipe(pipeSpeed));
      pipeSpeed += 0.1;
      counter = 0;
    }

    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j]) || birds[j].isOffScreen()) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }


      if (pipes[i].isOffScreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0
      nextGeneration();
      genCount++;
      pipes = [];
      pipeSpeed = pipeStartingSpeed;
    }
  }


    //all the drawing stuff
    background(0);

    for (let bird of birds) {
      bird.show();
    }
    for (let pipe of pipes) {
      pipe.show();
    }
  
  //update the html stuffs
  pSliderSpeed.html("Speed: " + slider.value());

  pPopSize.html("Current Population Size: " + birds.length);
  pCurrentScore.html("Current Score: " + birds[0].score);
  pPipeSpeed.html("Pipe Speed: " + round(pipeSpeed, 1));

  if (birds[0].score > recordScore) {
    recordScore = birds[0].score;
    bestBirdBrain = birds[0].brain.copy();
  }

  pRecordScore.html("Record Score: " + recordScore);
  pGenCount.html("Generation #" + genCount);
}

function saveBestBird() {

  saveJSON(bestBirdBrain, 'bird.json');
}

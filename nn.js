//number of input nodes, hidden nodes, output nodes
class NeuralNetwork {

  //normally, a will be an integer number of nodes in the Input layer, b will be the number of nodes in the hidden layer, and c will be the number of nodes in the output layer.
  //if a is an instance of a neural network, we will instead create a copy the given neural network
  constructor(a, b, c) {

    if (a instanceof NeuralNetwork) {
      this.inputNodes = a.inputNodes;
      this.hiddenNodes = a.hiddenNodes;
      this.outputNodes = a.outputNodes;

      this.weightsIH = a.weightsIH.copy();
      this.weightsHO = a.weightsHO.copy();
      this.biasH = a.biasH.copy();
      this.biasO = a.biasO.copy();

    } else {

      this.inputNodes = a;
      this.hiddenNodes = b;
      this.outputNodes = c;

      //weights between input and hidden layers
      //number of rows based on # of hidden nodes
      //number of columns based on # of input nodes
      this.weightsIH = new Matrix(this.hiddenNodes, this.inputNodes);

      //weights between hidden and output layers
      //number of rows based on # of output nodes
      //number of columns based on # of hidden nodes
      this.weightsHO = new Matrix(this.outputNodes, this.hiddenNodes);

      //initialize the weights matrices with random values
      this.weightsIH.randomize();
      this.weightsHO.randomize();

      //matrix of bias for hidden layer
      //only 1 row because we just need 1 bias per node in the hidden layer
      this.biasH = new Matrix(this.hiddenNodes, 1);


      //matrix of bias for output layer
      //only 1 row because we just need 1 bias per node in the output layer
      this.biasO = new Matrix(this.outputNodes, 1);

      //initialize the biases with random values
      this.biasH.randomize();
      this.biasO.randomize();
    }

    //learning rate. how large of adjustments do we make?
    this.learningRate = 0.01;
  }

  predict(inputArray) {

    //STEP 1: Generate hidden layer outputs

    //convert the input array to a matrix
    let inputs = Matrix.fromArray(inputArray);

    //compute the output of the hidden nodes
    //value of each hidden node is the weighted sum of the inputs and weights to that input, 
    //plus the bias of that hidden node.
    //doing matrix math like this allows us to calculate this for all nodes in hidden layer.
    let hidden = Matrix.multiply(this.weightsIH, inputs);
    hidden.add(this.biasH);

    //activation function (sigmoid function)
    //the "Map" function on a matrix applys the callback fuction (in this case sigmoid())
    //to all values in the matrix
    //we're converting all values in the hidden matrix to a value between -1,1
    hidden.map(sigmoid);

    //STEP 2: Generate output layer outputs

    //compute the output of the ouput layer
    //value of each output node is the weighted sum of the hidden nodes connected to the output node
    //and the weights of those connections, plus the bias of that output node
    let output = Matrix.multiply(this.weightsHO, hidden);
    output.add(this.biasO);

    //activation function on output layer
    output.map(sigmoid);

    //return an array of the outputs
    return output.toArray();
  }

  train(inputArray, targetArray) {
    //get an array of outputs

    //STEP 1: Generate hidden layer outputs

    //convert the input array to a matrix
    let inputs = Matrix.fromArray(inputArray);
    // print("Inputs:");
    // inputs.print();

    //compute the output of the hidden nodes
    //value of each hidden node is the weighted sum of the inputs and weights to that input, 
    //plus the bias of that hidden node.
    //doing matrix math like this allows us to calculate this for all nodes in hidden layer.
    let hidden = Matrix.multiply(this.weightsIH, inputs);
    hidden.add(this.biasH);



    //activation function (sigmoid function)
    //the "Map" function on a matrix applys the callback fuction (in this case sigmoid())
    //to all values in the matrix
    //we're converting all values in the hidden matrix to a value between -1,1
    hidden.map(sigmoid);

    // print("Hidden:");
    // hidden.print();


    //STEP 2: Generate output layer outputs

    //compute the output of the ouput layer
    //value of each output node is the weighted sum of the hidden nodes connected to the output node
    //and the weights of those connections, plus the bias of that output node
    let outputs = Matrix.multiply(this.weightsHO, hidden);
    outputs.add(this.biasO);

    //activation function on output layer
    outputs.map(sigmoid);

    // print("Outputs:");
    // print(outputs);

    //convert the targets array to a matrix so we can do matrix math
    let targets = Matrix.fromArray(targetArray);

    // print("Targets:");
    // targets.print();

    // calculate the output errors
    // ERROR = TARGETS - OUTPUTS
    let outputErrors = Matrix.subtract(targets, outputs);




    // calculate the hidden errors

    // first, transpose the weights between the hidden and output layer
    let tWeightsHO = Matrix.transpose(this.weightsHO);

    // print("Weights HO Transposed:");
    // tWeightsHO.print();

    // second, multiply tWeightsHO and outputErrors
    let hiddenErrors = Matrix.multiply(tWeightsHO, outputErrors);

    // print("Hidden Errors:");
    // console.log(hiddenErrors);

    //calculate change in weights between hidden and output layers
    // dWeightsHO = (learningRate) * (outputErrors * dOutput) dotProduct (hiddenLayer.transpose())

    // compute gradient (derivative of outputs)
    // dOutputs
    //let gradientsOutput = outputs * (1 - outputs);
    //apply the dSigmoid function to each node in the outputs matrix
    let gradientsOutput = Matrix.map(outputs, dSigmoid);




    //multiply gradients by outputErrors
    //element wise multiplication
    gradientsOutput.multiply(outputErrors);



    //multiply by learning rate
    //scalar multiplication
    gradientsOutput.multiply(this.learningRate);



    //get the hidden matrix, transposed
    let tHidden = Matrix.transpose(hidden);

    //change in weights between hidden and output layer = gradientsOutput dotProduct tHidden
    let dWeightsHO = Matrix.multiply(gradientsOutput, tHidden);

    //apply the change in weights to the actual weights
    this.weightsHO.add(dWeightsHO);

    //change in bias is just the gradient
    let dBiasO = gradientsOutput;
    this.biasO.add(dBiasO);


    //calculate change in weights between hidden and output layers
    //dWeightsIH = (learningRate) * (hiddenErrors * dHidden) dotProduct (inputLayer.transpose())

    // compute gradient (derivative of hidden)
    // dHidden
    //let gradientsHidden = hidden * (1 - hidden);
    //apply the dSigmoid function to each node in the hidden matrix
    let gradientsHidden = Matrix.map(hidden, dSigmoid);

    //multiply gradients by outputErrors
    //element wise multiplication
    gradientsHidden.multiply(hiddenErrors);

    //multiply by learning rate
    //scalar multiplication
    gradientsHidden.multiply(this.learningRate);

    //get the inputs matrix, transposed
    let tInputs = Matrix.transpose(inputs);

    //change in weights between inputs layer and hidden layer = gradientsHidden dotProduct tInputs
    let dWeightsIH = Matrix.multiply(gradientsHidden, tInputs);

    //apply the change in weights to the actual weights
    this.weightsIH.add(dWeightsIH);

    //change in biases is just the gradient;
    let dBiasH = gradientsHidden;
    this.biasH.add(dBiasH);
  }

  //functions for neuro-evolution

  copy() {
    let inputNodes = this.inputNodes;
    let hiddenNodes = this.hiddenNodes;
    let outputNodes = this.outputNodes;

    let nnCopy = new NeuralNetwork(this);
    return nnCopy;
  }

  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        //return Math.random() * 2 - 1;
        return val + randomGaussian(-0.1, 0.1);
      } else{
        return val;
      }
    }

    this.weightsIH.map(mutate);
    this.weightsHO.map(mutate);
    this.biasH.map(mutate);
    this.biasO.map(mutate);
  }

}

//global sigmoid function
//1/(1 + e^-x)
//returns a value between -1 and 1
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

//derivative of sigmoid
//used to calc the gradient
//this is what we would do if we weren't already applying sigmoid to the outputs
//return sigmoid(x) * (1 - sigmoid(x));
function dSigmoid(x) {
  let answer = x * (1 - x);
  return answer;
}
class Matrix {
  constructor(r, c) {
    this.rows = r;
    this.cols = c;

    this.data = new Array(this.rows);

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = new Array(this.cols);
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0.0;
      }
    }
  }

  //create a matrix from an array
  static fromArray(array) {
    //matrix with rows = array.length and 1 column
    //really creating a vector of size = array.length
    let m = new Matrix(array.length, 1);

    //put the values from the array into the matrix
    for (let i = 0; i < array.length; i++) {
      //cols = 0 because we created m with only 1 column
      m.data[i][0] = array[i];
    }

    return m;
  }

  //create an array to store the values of this matrix
  toArray() {
    let arr = [];
    //for every element in the matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }

    return arr;
  }

  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n;
        }
      }
    }
  }

  //return a new matrix that is the product of 2 given matrices
  static multiply(m1, m2) {
    //matrix product
    if (m1.cols !== m2.rows) {
      print("Multiplication error");
      return undefined;
    }
    let result = new Matrix(m1.rows, m2.cols);

    let a = m1.data;
    let b = m2.data;

    //multiply
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        //dot product
        let sum = 0;
        for (let k = 0; k < m1.cols; k++) {
          sum += a[i][k] * b[k][j];
        }
        result.data[i][j] = sum;
      }
    }

    return result;
  }

  //return a new matrix that is the result of subtracting one matrix from another (element wise subtraction);
  static subtract(m1, m2) {
    //check that number of rows and cols are the same
    if (m1.cols !== m2.cols || m1.rows !== m2.rows) {
      print("Subtraction error");
      return undefined;
    }

    let result = new Matrix(m1.rows, m1.cols);
    let a = m1.data;
    let b = m2.data;

    //subtract
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        result.data[i][j] = a[i][j] - b[i][j];
      }
    }

    return result;
  }

  multiply(n) {
    //are we trying to multiply a matrix?
    if (n instanceof Matrix) {
      //element wise multiplcation
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.data[i][j] *= n.data[i][j];
        }
      }
    } else {
      //scalar product
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
  }

  map(func) {
    // Apply a function to every element in matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }

  static map(m, fn) {
    let result = new Matrix(m.rows, m.cols);

    // Apply a function to every element in matrix
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {

        let val = m.data[i][j];
        let answer = fn(val);
        result.data[i][j] = answer;
      }
    }
    return result;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        //random value between -1,1
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  //create a new matrix from the given matrix with the rows and cols switched
  static transpose(matrix) {
    let result = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j];
      }
    }
    return result;
  }

  print() {
    console.table(this.data);
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }
}
'set strict'

/** Barnsley Fern: Draws a Barnsley fern fractal */

export class BarnsleyFern {

  constructor() {

    // The cursor position
    this.position = vec2.create()

    // The probability of each transformation
    this.transformation_probabilities = [
      0.01,
      0.85,
      0.07,
      0.07
    ]

    // Verify that probabilities add up to one
    if (this.transformation_probabilities.reduce(function(a, b) { return a + b }, 0) !== 1) {
      console.error('Transformation probabilities do not add up to 1.')
    }

    // The coordinate is transformed by the matrix (a, b, c, d)
    this.transformation_matrices = [
      mat2.fromValues( 0.00,  0.00,  0.00,  0.16),
      mat2.fromValues( 0.85, -0.04,  0.04,  0.85),
      mat2.fromValues( 0.20,  0.23, -0.26,  0.22),
      mat2.fromValues(-0.15,  0.26,  0.28,  0.24)
    ]

    // The coordinate then adds the vector (e, f)
    this.transformation_vectors = [
      vec2.fromValues(0.00, 0.00),
      vec2.fromValues(0.00, 1.60),
      vec2.fromValues(0.00, 1.60),
      vec2.fromValues(0.00, 0.44)
    ]

  }

  // Apply a random transformation to the cursor
  transform() {
    var random = Math.random()
    var sum = 0
    for (var i in this.transformation_probabilities) {
      sum += this.transformation_probabilities[i]
      if (random < sum) {
        vec2.transformMat2(this.position, this.position, this.transformation_matrices[i])
        vec2.add(this.position, this.position, this.transformation_vectors[i])
        break
      }
    }
  }

  // Apply the specified number of transformations, running the callback function with the new position at each iteration
  // Positions are in the range: −2.1818 < x < 2.6556 and 0 < y < 9.9585
  iterate(iterations, callback) {
    for (var i=0; i<iterations; i++) {
      this.transform()
      callback(this.position)
    }
  }

  // Reset position to origin
  reset() {
    this.position[0] = this.position[1] = 0
  }

}

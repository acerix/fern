'set strict'

/* WebGL utilities */

export class sWebGL {

  constructor(options) {

    var self = this

    if (typeof options === 'undefined') {
      options = {}
    }

    // Plugins
    this.plugins = options.hasOwnProperty('plugins') ? options.plugins : {}

    // Default parameters
    this.params = options.hasOwnProperty('params') ? options.params : {

      // Centre point
      x: 0,
      y: 0,

      // Scale of x, y
      sx: 1,
      sy: 1,

      // Rotation (0..1)
      r: 0
    }

    // Animation stops when not awake
    this.awake = true
    window.onfocus = function() {self.awake = true}
    window.onblur = function() {self.awake = false}

    // Function called for each frame
    this.drawScene = function() {}

    // Override parameters from params plugin
    if (typeof this.plugins.params === 'object') {
      for (var i in this.plugins.params.params) if (i in this.params) {
        this.params[i] = this.plugins.params.params[i]
      }
    }

    // Create canvas DOM element
    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    // Init canvas
    this.gl = this.canvas.getContext('webgl', {
      alpha: false,
      preserveDrawingBuffer: true
    })

    // Handle viewport resize
    window.onresize = function() {
      self.canvas.width = window.innerWidth
      self.canvas.height = window.innerHeight
      self.canvas.centre = [
        Math.floor(self.canvas.width/2),
        Math.floor(self.canvas.height/2)
      ]
      self.init()
    }

    // Trigger resize on init
    window.onresize()

    // Init plugins
    if (typeof this.plugins === 'object') {
      for (var i in this.plugins) if (typeof this.plugins[i].init === 'function') {
        this.plugins[i].init(this)
      }
    }

    this.life(this)

  }

  // Begin or restart rendering
  init() {
    var gl = this.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
    //gl.clearDepth(1.0)                 // Clear everything
    //gl.enable(this.gl.DEPTH_TEST)      // Enable depth testing
    //gl.depthFunc(this.gl.LEQUAL)       // Near things obscure far things
    this.initShaders()
  }

  // Load shaders
  initShaders() {
    var gl = this.gl
    var shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, this.getShader('shader-vs'))
    gl.attachShader(shaderProgram, this.getShader('shader-fs'))
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(shaderProgram))
    }

    gl.useProgram(shaderProgram)

    // Store color location.
    var colorLocation = gl.getUniformLocation(shaderProgram, 'u_color')

    // Look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position')

    // Set the resolution
    var resolutionLocation = gl.getUniformLocation(shaderProgram, 'u_resolution')
    gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height)

    // Create a buffer
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(positionLocation)

    // Send the vertex data to the shader program
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Set colour to green
    gl.uniform4f(colorLocation, 0, 1, 0, 1)

  }

  // Looping callback
  life(self) {

    // Pass sWebGL instance in the callback
    var callback = function() {
      self.life(self)
    }

    // Sleep in background
    if (!self.awake) return window.setTimeout(callback, 512)

    // Draw
    this.drawScene()

    // Loop after vsync
    window.requestAnimationFrame(callback)
  }

  // Load shader from <script>
  getShader(id) {
    var gl = this.gl
    var scriptElement = document.getElementById(id)
    if (scriptElement === null) {
      throw new Error('Shader script element "' + id + '" not found')
    }
    var shader = gl.createShader(gl[scriptElement.type.replace('text/x-','').toUpperCase()])
    gl.shaderSource(shader, scriptElement.textContent)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
  }

  // Draw a pixel on the canvas
  drawPixel(position) {
    var gl = this.gl
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
    gl.drawArrays(gl.POINTS, 0, 1)
  }

}

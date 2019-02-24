'set strict'

/** sPanel: Displays fern controls */

export class sPanel {

  constructor(options) {

    var self = this

    // <div> container for the panel
    this.div = document.createElement('div')
    this.div.style.position = 'absolute'
    this.div.style.top = this.div.style.right = '10px'
    this.div.style.color = '#0c0'

    // <table> for the sliders
    this.slider_table = document.createElement('table')
    var tbody = document.createElement('tbody')
    this.slider_table.appendChild(tbody)
    this.div.appendChild(this.slider_table)

    document.body.appendChild(this.div)

  }

  drawSliders(params, name, options) {

    if (typeof name === 'undefined') {
      name = '?'
    }

    for (var i in params) switch (typeof params[i]) {

      case 'number':
        this._drawSlider(params, i, name + '_' + i, options)
        break;

      case 'object':
        this.drawSliders(params[i], name + '_' + i, options)
        break;

      default:
        console.error('Undefined param type:', typeof params[i])
        break;

    }

  }

  _drawSlider(params, i, name, options) {

    if (typeof options === 'undefined') {
      options = {}
    }

    if (typeof options.min === 'undefined') {
      options.min = -2.0
    }
    if (typeof options.max === 'undefined') {
      options.max = 2.0
    }
    if (typeof options.onchange === 'undefined') {
      options.onchange = null
    }

    // Table row
    var tr = document.createElement('tr')

    // Label
    var label_td = document.createElement('td')
    var label = document.createTextNode(name)
    label_td.appendChild(label)
    tr.appendChild(label_td)

    // Input text
    var text_input_td = document.createElement('td')
    var text_input = document.createElement('input')
    text_input.type = 'number'
    text_input.step = 0.001
    text_input.value = params[i].toFixed(3)
    text_input_td.appendChild(text_input)
    tr.appendChild(text_input_td)

    // Input slider
    var range_input_td = document.createElement('td')
    var range_input = document.createElement('input')
    range_input.type = 'range'
    range_input.min = options.min
    range_input.max = options.max
    range_input.step = 0.01
    range_input.value = params[i]
    range_input_td.appendChild(range_input)
    tr.appendChild(range_input_td)

    // Callbacks when inputs change
    text_input.onchange = function(event) {
      params[i] = +event.target.value
      range_input.value = params[i]
      if (typeof options.onchange === 'function') {
        options.onchange(name)
      }
    }
    range_input.oninput = range_input.onchange = function(event) {
      params[i] = +event.target.value
      text_input.value = params[i].toFixed(3)
      if (typeof options.onchange === 'function') {
        options.onchange(name)
      }
    }

    // Add row to slider table
    this.slider_table.appendChild(tr)

  }

}

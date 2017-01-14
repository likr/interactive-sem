import cytoscape from 'cytoscape'

const groupToColor = (group) => {
  return (group === 'obs') ? '#16a085' : '#2980b9'
}

const groupToShape = (group) => {
  return (group === 'obs') ? 'roundrectangle' : 'ellipse'
}

const groupToAllowShape = (group) => {
  return (group === 'cov') ? 'triangle' : 'circle'
}

const valueToSize = (value) => {
  // 0..10 to 30..90
  return 6 * value + 30
}

const colorMap = 'mapData(p, 1, 0, #ecf0f1, #e74c3c)'

const style = cytoscape.stylesheet()
  .selector('node')
    .css({
      'content': 'data(name)',
      'width': (ele) => {
        const c = (ele.data('group') === 'obs') ? 2 : 1
        return c * valueToSize(ele.data('value'))
      },
      'height': (ele) => valueToSize(ele.data('value')),
      'shape': (ele) => groupToShape(ele.data('group')),
      'text-valign': 'center',
      'color': 'white',
      'text-outline-width': 2,
      'font-weight': 300,
      'text-outline-color': (ele) => groupToColor(ele.data('group')),
      'background-color': (ele) => groupToColor(ele.data('group'))
    })
  .selector('edge')
    .css({
      'label': 'data(value)',

      'text-outline-width': 2,
      'font-size': '0.8em',

      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'source-arrow-shape': (ele) => groupToAllowShape(ele.data('group')),

      'text-outline-color': colorMap,
      'line-color': colorMap,
      'source-arrow-color': colorMap,
      'target-arrow-color': colorMap,

      'width': 'mapData(value, 0, 1, 1, 10)'
    })

export let conf = {
  style: style,
  zoomingEnabled: true
}

export let layout = {
  name: 'cose',

  // Called on `layoutready`
  ready: () => {},

  // Called on `layoutstop`
  stop: () => {},

  // Whether to animate while running the layout
  animate: true,

  // The layout animates only after this many milliseconds
  // (prevents flashing on fast runs)
  animationThreshold: 250,

  // Number of iterations between consecutive screen positions update
  // (0 -> only updated on the end)
  refresh: 20,

  // Whether to fit the network view after when done
  fit: true,

  // Padding on fit
  padding: 5,

  // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox: undefined,

  // Randomize the initial positions of the nodes (true) or use existing positions (false)
  randomize: true,

  // Extra spacing between components in non-compound graphs
  componentSpacing: 300,

  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: (node) => 100000,

  // Node repulsion (overlapping) multiplier
  nodeOverlap: 10,

  // Ideal edge (non nested) length
  idealEdgeLength: (edge) => 15,

  // Divisor to compute edge forces
  edgeElasticity: (edge) => 100,

  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 10,

  // Gravity force (constant)
  gravity: 10,

  // Maximum number of iterations to perform
  numIter: 10000,

  // Initial temperature (maximum node displacement)
  initialTemp: 200,

  // Cooling factor (how the temperature is reduced between consecutive iterations
  coolingFactor: 0.95,

  // Lower temperature threshold (below this point the layout will end)
  minTemp: 1.0,

  // Whether to use threading to speed up the layout
  useMultitasking: true
}


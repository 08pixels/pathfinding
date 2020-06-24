const gridHeight  = 10
const gridWidth   = 12

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function staticGrid() {

  return [
    [-2,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0, 0, 0,-1,-1,-1,-1,-1, 0, 0],
    [ 0,-1, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0,-1, 0,-1, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0,-1, 0,-1, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0],
    [ 0,-1, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0],
    [ 0,-1, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0],
    [ 0, 0, 0,-1, 0, 0, 0, 0, 0, 0,-1,-3],
  ]
}

function isValid(x, y) {
  let canX = x >= 0 && x < gridHeight
  let canY = y >= 0 && y < gridWidth

  return canX && canY
}

function PathFinding(grid) {

  let move_i = [0, 0, 1,-1]
  let move_j = [1,-1, 0, 0]

  let queue = []

  // source position
  queue.push({x: 0, y: 0, distance: 0})

  return () => {
    while(queue.length != 0) {
  
      let current = queue.shift()
  
      for(let i=0; i<4; ++i) {
        let u = current.x + move_i[i]
        let v = current.y + move_j[i]
        let w = current.distance
  
        if(isValid(u, v) && grid[u][v] == 0) {
          queue.push({x: u, y:v, distance: 1 + w})
  
          if(grid[u][v] == 2)
            return true

          grid[u][v]    = 1 + w;
          renderGrid(grid)
        }
      }
      return false
    }
  }
}

function renderGrid(grid) {
  let html = '<table cellpadding=0 cellspaing=0>'

  for(let row=0; row < gridHeight; ++row) {
    html += '<tr>'

    for(let col=0; col < gridWidth; ++col) {

      switch (grid[row][col]) {
        case 0:
          html += `<td id="Empty"}> </td>`
          break
        case -1:
          html += `<td id="Obstacle"}> </td>`
          break
        case -2:
          html += `<td id="Source"}></td>`
          break
        case -3:
          html += `<td id="Goal"}></td>`
          break
        case -4:
          html += `<td id="Trip"}></td>`
          break 
        default:
          html += `<td id="Trip"}> ${grid[row][col]} </td>`
      }
    }

    html += '</tr>'
  }

  html += '</table>'
  document.querySelector('#grid').innerHTML = html
}

function start() {
  const grid = staticGrid()
  renderGrid(grid)

  const executingPath = PathFinding(grid)
  setInterval(() => executingPath(), 50)
}

start()

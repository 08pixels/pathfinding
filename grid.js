const gridHeight  = 20
const gridWidth   = 30

function populateGrid(grid) {
  let height = grid.length
  let width  = grid[0].length

  let rateObstacles = Math.floor(height * width * 0.25)

  let counterObstacles = 0

  while(counterObstacles < rateObstacles) {
    let guestRow = Math.trunc(Math.random() * height) 
    let guestCol = Math.trunc(Math.random() * width)

    if(grid[guestRow][guestCol] == 0) {
      grid[guestRow][guestCol] = -1
      ++counterObstacles
    }
  }

  return grid
}

function emptyGrid(height, width) {
  let grid = []

  for(let i=0; i<height; i++) {
    row = Array(width).fill(0)
    grid.push(row)
  }

  return grid
}

function generateGrid(height, width) {
  
  let grid = emptyGrid(height, width)

  grid[0][0] = -2 // source
  grid[height-1][width-1] = -3 // destine
  grid = populateGrid(grid)

  return grid
}

function isValid(x, y) {
  let canX = x >= 0 && x < gridHeight
  let canY = y >= 0 && y < gridWidth

  return canX && canY
}

function PathFinding(grid) {

  let foundPath = false
  let move_i    = [0, 0, 1,-1]
  let move_j    = [1,-1, 0, 0]

  let queue   = []
  let path    = []
  let parent  = emptyGrid(grid.length, grid[0].length)

  // source position
  queue.push({x: 0, y: 0, distance: 0})

  const recoverPath = () => {
    let u = gridHeight - 1
    let v = gridWidth  - 1

    let path = []

    while(parent[u][v] != 0) {
      
      x = parseInt(parent[u][v] % gridWidth)
      u = parseInt(parent[u][v] / gridWidth)
      v = x

      path.push({x:u, y:v})
    }
    return path
  }

  const printPath = () => {

    if(path.length) {
      let kPath = path.shift()
      grid[kPath.x][kPath.y] = -4
      
      return renderGrid(grid)
    }
  }

  const search = () => {
    while(queue.length != 0) {
  
      let current = queue.shift()
  
      for(let i=0; i<4; ++i) {
        let u = current.x + move_i[i]
        let v = current.y + move_j[i]
        let w = current.distance
  
        if(isValid(u, v) && (grid[u][v] == 0 || grid[u][v] == -3)) {
          queue.push({x: u, y:v, distance: 1 + w})
          parent[u][v] = current.x * gridWidth + current.y

          if(grid[u][v] != -3) {
            grid[u][v] = 1 + w; 
          }

          renderGrid(grid)
        }
      }
      return
    }

    foundPath = true
    path      = recoverPath().reverse() 
  }

  return () => foundPath ? printPath() : search();
}

function renderGrid(grid) {
  let html = '<table cellpadding=0 cellspaing=0>'
  let length = 0

  for(let row=0; row < gridHeight; ++row) {
    html += '<tr>'

    for(let col=0; col < gridWidth; ++col) {
      switch (grid[row][col]) {
        case 0:
          html += `<td class="Empty"}> </td>`
          break
        case -1:
          html += `<td class="Obstacle"}> </td>`
          break
        case -2:
          html += `<td class="Source"}></td>`
          break
        case -3:
          html += `<td class="Goal"}></td>`
          break
        case -4:
          html += `<td class="Path"}></td>`
          break 
        default:
          html += `<td class="Trip"}></td>`
      }
    }

    html += '</tr>'
  }

  html += '</table>'
  document.querySelector('#grid').innerHTML = html
}

function start() {
  const grid = generateGrid(20, 30)
  renderGrid(grid)

  const executingPath = PathFinding(grid)
  setInterval(() => executingPath(), 10)
}

start()

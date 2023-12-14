import * as fs from 'fs';

const DIRS = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
  up: [-1, 0],
};

function solution() {
  let input = fs.readFileSync('./10/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let grid = input.map(row => row.split(''));

  let loopCells = detectLoop(grid);

  let insideCount = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (loopCells.has([i, j].join(','))) continue;

      if (isInside(i, j, grid, loopCells)) insideCount++;
    }
  }

  return insideCount;
}

function isInside(i, j, grid, loopCells) {
  let isInside = false;
  let row = grid[i];

  let verticalPipes = new Set('|LJ'.split(''));

  for (let k = j; k < row.length; k++) {
    let cell = grid[i][k];
    let key = [i, k].join(',');

    if (loopCells.has(key) && verticalPipes.has(cell)) {
      isInside = !isInside;
    }
  }

  return isInside;
}
 
function detectLoop(grid) {
  let startPosition = getStartPosition(grid);
  let currentPosition = startPosition;
  let visited = new Set;

  while (!visited.has(currentPosition.join(','))) { 
    let key = currentPosition.join(',');
    visited.add(key);

    let [i, j] = currentPosition;

    for (let [key, value] of Object.entries(DIRS)) {
      let newI = i + value[0];
      let newJ = j + value[1];
      
      if (shouldVisit(grid, key, currentPosition, [newI, newJ], visited)) {
        currentPosition = [newI, newJ];
        break;
      }
    }
  }

  replaceStartChar(startPosition, grid, visited);
  return visited;
}

function replaceStartChar(startPosition, grid, visited) {
  let [i, j] = startPosition;
  let left = visited.has([i, j - 1].join(','));
  let right = visited.has([i, j + 1].join(','));
  let down = visited.has([i + 1, j].join(','));
  let up = visited.has([i - 1, j].join(','));

  if (left && right) {
    grid[i][j] = '-';
  } else if (down && up) {
    grid[i][j] = '|';
  } else if (down && right) {
    grid[i][j] = 'F';
  } else if (down && left) {
    grid[i][j] = '7';
  } else if (up && right) {
    grid[i][j] = 'L';
  } else if (up && left) {
    grid[i][j] = 'J';
  }
}

function getStartPosition(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 'S') {
        return [i, j];
      }
    }
  }
}

const CONNECTION_SETS = {
  up: new Set(['|', '7', 'F']),
  down: new Set(['|', 'J', 'L']),
  left: new Set(['-', 'L', 'F']),
  right: new Set(['-', 'J', '7'])
}

const CONNECTION_DIRS = {
  '|': new Set(['up', 'down']),
  '-': new Set(['left', 'right']),
  'L': new Set(['up', 'right']),
  'J': new Set(['up', 'left']),
  '7': new Set(['left', 'down']),
  'F': new Set(['down', 'right']),
}

function shouldVisit(grid, direction, currentPosition, newPosition, visited) {
  let [i, j] = currentPosition;
  let [newI, newJ] = newPosition;
  let key = newPosition.join(',');
  if (visited.has(key) || newI < 0 || newI >= grid.length || newJ < 0 || newJ >= grid[0].length) return false;

  let currentCell = grid[i][j];
  let nextCell = grid[newI][newJ];

  if (visited.has(key)) {
    return false;
  } else {
    let validDirections = CONNECTION_DIRS[currentCell];
    if (currentCell !== 'S' && (!validDirections || !validDirections.has(direction))) return false;

    return CONNECTION_SETS[direction].has(nextCell);
  }
}

console.log(solution());
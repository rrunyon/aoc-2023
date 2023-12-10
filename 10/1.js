import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./10/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let grid = input.map(row => row.split(''));

  let startPosition = getStartPosition(grid);
  return getLongestPath(grid, startPosition) / 2;
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

const DIRS = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
  up: [-1, 0],
};

function getLongestPath(grid, position, depth = 1, visited = new Set) {
  let key = position.join(',');
  visited.add(key);

  // console.log('----------------');
  // console.log('depth: ', depth)
  // console.log('visited: ', visited)

  let [i, j] = position;
  let max = depth;
  for (let [key, value] of Object.entries(DIRS)) {
    let newI = i + value[0];
    let newJ = j + value[1];
    
    if (shouldVisit(grid, key, position, [newI, newJ], visited)) {
      max = Math.max(max, getLongestPath(grid, [newI, newJ], depth + 1, visited));
    }
  }

  visited.delete(key);

  return max;
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
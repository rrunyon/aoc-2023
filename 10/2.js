import * as fs from 'fs';
import { Queue } from '@datastructures-js/queue';

/*
Flood fill: Traverse grid and identify pipe gaps. Replace those cells with > or ^ characters depending on the direction
of the grap. Then, from each cell, initial BFS/flood fill that terminates if there are no ',' or gap cells to visit.
When the flood fill terminates, if we were not able reach the outside of the grid, replace those cells with 'I'. Count
'I' to determine number of trapped cells. 
*/

const DIRS = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
  up: [-1, 0],
};

function solution() {
  let input = fs.readFileSync('./10/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let grid = input.map(row => row.split(''));

  detectLoop(grid);
  detectVerticalPipes(grid);
  detectHorizontalPipes(grid);

  let blacklist = new Set(['%', '^', '>', 'I']);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let cell = grid[i][j];

      if (!blacklist.has(cell)) {
        let set = floodFill(i, j, grid);
        if (set.size) {
          for (let position of set) {
            let [i, j] = position.split(',').map(num => parseInt(num));
            grid[i][j] = 'I';
          }
        }
      }
    }
  }

  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 'I') sum++;
    }
  }

  return sum;
}

function detectLoop(grid) {
  let currentPosition = getStartPosition(grid);
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

  // for (let position of visited) {
  //   let [i, j] = position.split(',').map(num => parseInt(num));
  //   grid[i][j] = '%';
  // }
}

function floodFill(i, j, grid) {
  let visited = new Set;
  let queue = new Queue;
  let key = [i, j].join(',');
  queue.enqueue([i, j]);
  visited.add(key);

  let edgeReached = false;

  while (queue.size()) {
    let [i, j] = queue.dequeue();
    let cell = grid[i][j];

    for (const [key, value] of Object.entries(DIRS)) {
      let newI = i + value[0];
      let newJ = j + value[1];
      let newKey = [newI, newJ].join(',');

      if (newI === 0 || newI === grid.length || newJ === 0 || newJ === grid[0].length) {
        edgeReached = true;
      }

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && !visited.has(newKey)) {
        let newCell = grid[newI][newJ];

        if ((key === 'down' || key === 'up') && newCell !== '>' && newCell !== '%') {
          visited.add(newKey);
          queue.enqueue([newI, newJ]);
        } else if ((key === 'left' || key === 'right') && newCell !== '^' && newCell !== '%') {
          visited.add(newKey);
          queue.enqueue([newI, newJ]);
        }
      }
    }
  }

  return edgeReached ? new Set : visited;
}

function detectVerticalPipes(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 1; j < grid[1].length; j++) {
      let left = grid[i][j - 1];
      let right = grid[i][j];

      let positions = new Set;
      if (left === '7' && right === 'F') {
        positions = scanDown(i, j);
        updateGaps(positions);
      } else if (left === 'J' && right === 'L') {
        positions = scanUp(i, j);
        updateGaps(positions);
      } else if ((left === '7' || left === 'J') && (right === 'F' || right === 'L')) {
        positions = scanUp(i, j)
        updateGaps(positions);
        positions = scanDown(i, j)
        updateGaps(positions);
      }
    }
  }

  function updateGaps(positions) {
    if (positions.size) {
      for (let position of positions) {
        let [i, j] = position.split(',').map(num => parseInt(num));

        grid[i][j] = '^';
      }
    }
  }

  function scanDown(i, j, visited = new Set) {
    let key = [i, j].join(',');
    visited.add(key);

    let nextI = i + 1;
    let nextLeft = grid[nextI][j - 1];
    let nextRight = grid[nextI][j];
    if (nextLeft === '|' && nextRight === '|') {
      scanDown(nextI, j, visited);
    } else if (nextLeft = 'J' && nextRight == 'L') {
      let lastKey = [nextI, j].join(',');
      visited.add(lastKey);
      return visited;
    }

    return new Set;
  }

  function scanUp(i, j, visited = new Set) {
    let key = [i, j].join(',');
    visited.add(key);

    let nextI = i - 1;
    let nextLeft = grid[nextI][j - 1];
    let nextRight = grid[nextI][j];
    if (nextLeft === '|' && nextRight === '|') {
      scanDown(nextI, j, visited);
    } else if (nextLeft = '7' && nextRight == 'F') {
      let lastKey = [nextI, j].join(',');
      visited.add(lastKey);
      return visited;
    }

    return new Set;
  }
}

function detectHorizontalPipes(grid) {
  for (let i = 1; i < grid.length; i++) {
    for (let j = 0; j < grid[1].length; j++) {
      let top = grid[i - 1][j];
      let bottom = grid[i][j];

      let positions = new Set;
      if (top === 'L' && bottom === 'F') {
        positions = scanRight(i, j);
      } else if (top === 'J' && bottom === '7') {
        positions = scanLeft(i, j);
      }

      if (positions.size) {
        for (let position of positions) {
          let [i, j] = position.split(',').map(num => parseInt(num));

          grid[i][j] = '>';
        }
      }
    }
  }

  function scanRight(i, j, visited = new Set) {
    let key = [i, j].join(',');
    visited.add(key);
    let nextJ = j + 1;

    let nextTop = grid[i - 1][nextJ];
    let nextBottom = grid[i][nextJ];
    if (nextTop === '-' && nextBottom === '-') {
      scanRight(i, nextJ, visited);
    } else if (nextTop = 'J' && nextBottom== '7') {
      let lastKey = [i, nextJ].join(',');
      visited.add(lastKey);
      return visited;
    }

    return new Set;
  }

  function scanLeft(i, j, visited = new Set) {
    let key = [i, j].join(',');
    visited.add(key);
    let nextJ = j - 1;

    let nextTop = grid[i - 1][nextJ];
    let nextBottom = grid[i][nextJ];
    if (nextTop === '-' && nextBottom === '-') {
      scanLeft(i, nextJ, visited);
    } else if (nextTop = 'L' && nextBottom == 'F') {
      let lastKey = [i, nextJ].join(',');
      visited.add(lastKey);
      return visited;
    }

    return new Set;
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
import * as fs from 'fs';

const LEFT = 'left';
const RIGHT = 'right';
const DOWN = 'down';
const UP = 'up';

const DIRS = {
  [LEFT]: [0, -1],
  [RIGHT]: [0, 1],
  [DOWN]: [1, 0],
  [UP]: [-1, 0],
}

function solution() {
  let input = fs.readFileSync('./17/test-input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = input.map(row => row.split('').map(cell => parseInt(cell)));

  let globalMinPath = Infinity;
  getMinimumPath(0, 0, RIGHT, 1);
  return globalMinPath;

  function getMinimumPath(i, j, direction, directionCount, pathValue = 0, visited = new Set) {
    if (pathValue >= globalMinPath) return;

    let key = [i, j].join();
    if (visited.has(key)) return;

    visited.add(key);

    pathValue += grid[i][j];
    
    if (i === grid.length - 1 && j === grid[0].length - 1) {
      visited.delete(key);
      globalMinPath = Math.min(globalMinPath, pathValue);
      return;
    }

    let minimumPath = Infinity;
    for (let [key, value] of Object.entries(DIRS)) {
      let newI = i + value[0];
      let newJ = j + value[1];
      let newKey = [newI, newJ].join();

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && !visited.has(newKey)) {
        if (key === direction && directionCount < 3) {
          minimumPath = Math.min(minimumPath, getMinimumPath(newI, newJ, key, directionCount + 1, pathValue, visited));
        } else if (key !== direction) {
          minimumPath = Math.min(minimumPath, getMinimumPath(newI, newJ, key, 1, pathValue, visited));
        }
      }
    }

    visited.delete(key);
    return minimumPath;
  }
}

console.log(solution());
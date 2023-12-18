import { Queue } from '@datastructures-js/queue';
import * as fs from 'fs';

const DIRS = {
  L: [0, -1],
  R: [0, 1],
  D: [1, 0],
  U: [-1, 0],
}

function solution() {
  let input = fs.readFileSync('./18/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = new Array(10000);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(10000).fill('.');
  }

  let instructions = input.map(parseInstruction);
  dig(grid, instructions);
  floodFillTrench(grid);
  return countTrenchArea(grid);
}

function parseInstruction(row) {
  let [direction, distance, hex] = row.split(' ');

  direction = DIRS[direction];
  distance = parseInt(distance);

  return [direction, distance, hex];
}

function dig(grid, instructions) {
  let startI = grid.length / 2;
  let startJ = grid[0].length / 2;
  let currentPosition = [startI, startJ];

  for (let [direction, distance] of instructions) {
    for (let i = 0; i < distance; i++) {
      let [i, j] = currentPosition;
      let nextI = i + direction[0];
      let nextJ = j + direction[1];
      grid[nextI][nextJ] = '#';

      currentPosition = [nextI, nextJ];
    }
  }
}

function floodFillTrench(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let cell = grid[i][j];
      if (cell === '#') {
        let downI = i + DIRS.D[0]
        let downJ = j + DIRS.D[1];
        let rightI = i + DIRS.R[0]
        let rightJ = j + DIRS.R[1];

        let downCell = grid[downI][downJ];
        let rightCell = grid[rightI][rightJ];

        if (downCell === '.') {
          floodFill(grid, downI, downJ);
          return;
        } else if (rightCell === '.') {
          floodFill(grid, rightI, rightJ);
          return;
        }
      }
    }
  }
}

function floodFill(grid, startI, startJ) {
  let start = [startI, startJ];
  let queue = new Queue;
  queue.enqueue(start);

  let visited = new Set;
  visited.add(start.join())

  while (queue.size()) {
    let [i, j] = queue.dequeue();
    
    grid[i][j] = '#';

    for (let dir of Object.values(DIRS)) {
      let newI = i + dir[0];
      let newJ = j + dir[1];

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length) {
        let cell = grid[newI][newJ];
        let newKey = [newI, newJ].join();
        if (cell === '.' && !visited.has(newKey)) {
          queue.enqueue([newI, newJ]);
          visited.add(newKey);
        }
      }
    }
  }
}

function countTrenchArea(grid) {
  let sum = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '#') sum++;
    }
  }

  return sum;
}

console.log(solution());
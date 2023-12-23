import * as fs from 'fs';
import { Queue } from '@datastructures-js/queue';

function solution() {
  let input = fs.readFileSync('./21/test-input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = parseGrid(input);
  return traverseGrid(grid, { steps: 26501365 });
}

function parseGrid(input) {
  return input.map(row => row.split(''));
}

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function traverseGrid(grid, { steps }) {
  let queue = new Queue;
  let startPosition = getStartPosition(grid);
  queue.enqueue(startPosition);

  let visiting = new Set;

  for (let i = 0; i < steps; i++) {
    if (steps % 1000 === 0) console.log(steps);

    // printGrid(grid, visiting);
    visiting.clear();
    let size = queue.size();
    for (let i = 0; i < size; i++) {
      let [i, j] = queue.dequeue();

      for (let dir of dirs) {
        let newI = i + dir[0];
        let newJ = j + dir[1];
        let newKey = [newI, newJ].join();

        if (!visiting.has(newKey)) {
          let correctedI;
          let correctedJ;

          if (newI >= 0) {
            correctedI = newI % (grid.length - 1);
          } else {
            correctedI = grid.length - 1 - Math.abs(newI % (grid.length - 1));
          }

          if (newJ >= 0) {
            correctedJ = newJ % (grid[0].length - 1);
          } else {
            correctedJ = grid[0].length - 1 - Math.abs(newJ % (grid[0].length - 1));
          }

          let newCell = grid[correctedI][correctedJ];
          if (newCell !== '#') {
            visiting.add(newKey);
            queue.enqueue([newI, newJ]);
          }
        }
      }
    }
  }

  return visiting.size;
}

function printGrid(grid, visiting) {
  console.log();
  for (let i = 0; i < grid.length; i++) {
    let row = [];
    for (let j = 0; j < grid.length; j++){
      let key = [i, j].join();
      if (visiting.has(key)) {
        row.push('O');
      } else {
        row.push([grid[i][j]]);
      }
    }
    console.log(row.join(''));
  }
}

function getStartPosition(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 'S') return [i, j];
    }
  }
}

console.log(solution());
import * as fs from 'fs';
import { Queue } from '@datastructures-js/queue';

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
  let input = fs.readFileSync('./16/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = input.map(row => row.split(''));
  let maxEnergy = -Infinity;

  for (let i = 0; i < grid.length; i++) {
    maxEnergy = Math.max(maxEnergy, countEnergizedCellsFrom(grid, i, 0, RIGHT));
    maxEnergy = Math.max(maxEnergy, countEnergizedCellsFrom(grid, i, grid[0].length - 1, LEFT));
  }

  for (let j = 0; j < grid[0].length; j++) {
    maxEnergy = Math.max(maxEnergy, countEnergizedCellsFrom(grid, 0, j, DOWN));
    maxEnergy = Math.max(maxEnergy, countEnergizedCellsFrom(grid, grid.length - 1, j, UP));
  }

  return maxEnergy;
}

function countEnergizedCellsFrom(grid, i, j, initialDirection) {
  let queue = new Queue;
  let visited = new Set;
  let memo = new Set;

  queue.enqueue(JSON.stringify({ position: [i, j], direction: initialDirection }));
  visited.add([0, 0].join());
  memo.add(JSON.stringify({ position: [i, j], direction: initialDirection }));

  while (queue.size()) {
    let { position, direction } = JSON.parse(queue.dequeue());
    let [i, j] = position;
    let cell = grid[i][j];

    let newI;
    let newJ;
    let newDirection;
    let nextNodes = [];
    switch (cell) {
      case '.': 
        newI = i + DIRS[direction][0];
        newJ = j + DIRS[direction][1];
        nextNodes.push({ position: [newI, newJ], direction })
        break;
      case '/':
        if (direction === LEFT) {
          newDirection = DOWN;
        } else if (direction === RIGHT) {
          newDirection = UP;
        } else if (direction === DOWN) {
          newDirection = LEFT;
        } else if (direction === UP) {
          newDirection = RIGHT;
        }

        newI = i + DIRS[newDirection][0];
        newJ = j + DIRS[newDirection][1];
        nextNodes.push({ position: [newI, newJ], direction: newDirection })
        break;
      case '\\':
        if (direction === LEFT) {
          newDirection = UP;
        } else if (direction === RIGHT) {
          newDirection = DOWN;
        } else if (direction === DOWN) {
          newDirection = RIGHT;
        } else if (direction === UP) {
          newDirection = LEFT;
        }

        newI = i + DIRS[newDirection][0];
        newJ = j + DIRS[newDirection][1];
        nextNodes.push({ position: [newI, newJ], direction: newDirection })
        break;
      case '-':
        if (direction === LEFT || direction === RIGHT) {
          newI = i + DIRS[direction][0];
          newJ = j + DIRS[direction][1];
          nextNodes.push({ position: [newI, newJ], direction })
        } else {
          let leftI = i + DIRS[LEFT][0];
          let leftJ = j + DIRS[LEFT][1];
          let rightI = i + DIRS[RIGHT][0];
          let rightJ = j + DIRS[RIGHT][1];

          nextNodes.push({ position: [leftI, leftJ], direction: LEFT })
          nextNodes.push({ position: [rightI, rightJ], direction: RIGHT })
        }
        break;
      case '|':
        if (direction === UP || direction === DOWN) {
          newI = i + DIRS[direction][0];
          newJ = j + DIRS[direction][1];
          nextNodes.push({ position: [newI, newJ], direction })
        } else {
          let upI = i + DIRS[UP][0];
          let upJ = j + DIRS[UP][1];
          let downI = i + DIRS[DOWN][0];
          let downJ = j + DIRS[DOWN][1];

          nextNodes.push({ position: [upI, upJ], direction: UP })
          nextNodes.push({ position: [downI, downJ], direction: DOWN })
        }
        break;
    }

    for (let node of nextNodes) {
      let [newI, newJ] = node.position;
      let visitedKey = node.position.join();
      let memoKey = JSON.stringify(node);

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && !memo.has(memoKey)) {
        queue.enqueue(JSON.stringify(node));
        visited.add(visitedKey);
        memo.add(memoKey);
      }
    }
  }

  return visited.size;
}

console.log(solution());
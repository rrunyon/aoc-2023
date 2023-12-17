import * as fs from 'fs';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

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

class Node {
  constructor({ parent, position, direction, directionCount, g, h }) {
    this.parent = parent;
    this.position = position;
    this.direction = direction;
    this.directionCount = directionCount;
    this.g = g;
    this.h = h;
    this.f = g + h;
  }

  get key() {
    return this.position.join();
  }
}

function aStar(grid, start, end) {
  let open = new MinPriorityQueue(node => node.f);
  let openMap = new Map;
  let closed = new Set;

  let startNode = new Node({
    position: start,
    direction: RIGHT,
    directionCount: 1,
    g: 0,
    // h: Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]),
    h: 0,
  });

  open.enqueue(startNode);
  openMap.set(startNode.key, startNode);

  let calls = 1;
  while(open.size()) {
    console.log('calls: ', calls++);
    let current = open.dequeue();
    console.log(current.position, current.g, current.h, current.f);
    closed.add(current.key);
    openMap.delete(current.key);

    if (current.position[0] === end[0] && current.position[1] === end[1]) {
      return current;
    }

    for (let [key, value] of Object.entries(DIRS)) {
      if (key === current.direction && current.directionCount === 3) continue;

      let newI = current.position[0] + value[0];
      let newJ = current.position[1] + value[1];

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length) {
        let neighbor = new Node({
          parent: current,
          position: [newI, newJ],
          direction: key,
          directionCount: key === current.direction ? current.directionCount + 1 : 1,
          g: current.g + Math.abs(newI - start[0]) + Math.abs(newJ - start[1]) + grid[newI][newJ],
          // h: Math.abs(newI - end[0]) + Math.abs(newJ - end[1]),
          h: 0,
        });

        if (closed.has(neighbor.key)) {
          continue;
        }

        if (openMap.has(neighbor.key)) {
          let openNeighbor = openMap.get(neighbor.key);

          if (openNeighbor.g > neighbor.g) {
            let dequeued = [];
            while (open.front().key !== openNeighbor.key) {
              dequeued.push(open.dequeue());
            }

            open.dequeue();

            for (let node of dequeued) {
              open.enqueue(node);
            }
          } else {
            continue;
          }
        }

        open.enqueue(neighbor);
        openMap.set(neighbor.key, neighbor);
      }
    }
  }
}

function solution() {
  let input = fs.readFileSync('./17/test-input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = input.map(row => row.split('').map(cell => parseInt(cell)));

  let endNode = aStar(grid, [0, 0], [grid.length - 1, grid[0].length - 1]);
  let totalCost = paintGrid(grid, endNode);
  printGrid(grid);
  return totalCost;
}

function paintGrid(grid, node) {
  let current = node;
  let cost = 0;
  while (current) {
    let [i, j] = current.position;
    let cell = grid[i][j];
    if (isNaN(cell)) {
      console.log(cell);
    }
    cost += cell;
    grid[i][j] = '#';
    current = current.parent;
  }

  return cost;
}

function printGrid(grid) {
  for (let row of grid) {
    console.log(row.join());
  }
}

console.log(solution());
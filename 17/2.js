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

const OPPOSITES = {
  [LEFT]: RIGHT,
  [RIGHT]: LEFT,
  [DOWN]: UP,
  [UP]: DOWN,
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

  let startNode1 = new Node({
    position: start,
    direction: RIGHT,
    directionCount: 0,
    g: 0,
    h: (Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])),
    // h: 0,
  });

  let startNode2 = new Node({
    position: start,
    direction: DOWN,
    directionCount: 0,
    g: 0,
    h: (Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])),
    // h: 0,
  });

  open.enqueue(startNode1);
  open.enqueue(startNode2);

  let visited = new Set;

  while(open.size()) {
    let current = open.dequeue();

    let key = [current.key, current.direction, current.directionCount].join();
    if (visited.has(key)) continue;
    visited.add(key);

    if (current.position[0] === end[0] && current.position[1] === end[1] && current.directionCount > 3) {
      return current;
    }

    if (current.directionCount < 4) {
      let newI = current.position[0] + DIRS[current.direction][0]; 
      let newJ = current.position[1] + DIRS[current.direction][1];

      if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length) {
        let neighbor = new Node({
          parent: current,
          position: [newI, newJ],
          direction: current.direction,
          directionCount: current.directionCount + 1,
          g: current.g + grid[newI][newJ],
          h: 0,
          h: (Math.abs(newI - end[0]) + (Math.abs(newJ - end[1]))),
        });

        open.enqueue(neighbor);
      }
    } else {
      for (let [key, value] of Object.entries(DIRS)) {
        let newI = current.position[0] + value[0];
        let newJ = current.position[1] + value[1];

        if (key === current.direction && current.directionCount === 10) continue;
        if (key === OPPOSITES[current.direction]) continue;

        if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length) {
          let neighbor = new Node({
            parent: current,
            position: [newI, newJ],
            direction: key,
            directionCount: key === current.direction ? current.directionCount + 1 : 1,
            g: current.g + grid[newI][newJ],
            // h: 0,
            h: (Math.abs(newI - end[0]) + (Math.abs(newJ - end[1]))),
          });

          open.enqueue(neighbor);
        }
      }
    }
  }
}

function solution() {
  let input = fs.readFileSync('./17/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = input.map(row => row.split('').map(cell => parseInt(cell)));

  return aStar(grid, [0, 0], [grid.length - 1, grid[0].length - 1]).g;
}

console.log(solution());
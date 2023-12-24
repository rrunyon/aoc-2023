import * as fs from 'fs';
import { PriorityQueue  } from '@datastructures-js/priority-queue';

function solution() {
  let input = fs.readFileSync('./22/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let bricks = input.map((row, i) => new Brick(row, i));
  let positionMap = updateBrickPositions(bricks);
  let queue = new PriorityQueue((a, b) => {
    let aMinZ = Math.min(a.start[2], a.end[2]);
    let bMinZ = Math.min(b.start[2], b.end[2]);
    return aMinZ - bMinZ;
  });

  for (let brick of bricks) queue.enqueue(brick);

  while (queue.size()) {
    let brick = queue.dequeue();

    let allPositions = new Set(Array.from(positionMap.values()).flat());

    let { start, end } = brick;

    while (true) {
      let lowestZ = Math.min(start[2], end[2]);
      if (lowestZ === 1) break;

      if (brick.orientation === Z) {
        let bottom = (start[2] < end[2]) ? start : end;
        let next = [...bottom];
        next[2]--;
        if (!allPositions.has(next.join())) {
          let positions = positionMap.get(brick.index);
          let nextPositions = positions.map(position => {
            let nextPosition = [...position.split(',')];
            nextPosition[2]--;
            return nextPosition.join();
          });
          positionMap.set(brick.index, nextPositions);
          brick.start[2]--;
          brick.end[2]--;
        } else {
          break;
        }
      } else {
        let positions = positionMap.get(brick.index);
        let nextPositions = positions.map(position => {
          // console.log(position);
          let nextPosition = [...position.split(',')];
          nextPosition[2]--;
          return nextPosition.join();
        });

        // If none of our next positions are currently occupied, commit the negative z transform
        if (!nextPositions.some(pos => allPositions.has(pos))) {
          positionMap.set(brick.index, nextPositions);
          brick.start[2]--;
          brick.end[2]--;
        } else {
          break;
        }
      }
    }

    // printPositions(positionMap);
    console.log(`brick ${brick.index} settled at ${brick.start}, ${brick.end}`);
  }

  // checkIntegrity(positionMap);

  let safeCount = 0;
  for (let brick of bricks) {
    console.log('simulating removing brick: ', brick.index);
    let result = simulateFallingWithout(brick, bricks, positionMap);
    if (result) {
      console.log(`brick ${brick.index} is safe to remove`);
      safeCount++;
    }
    console.log(safeCount);
  }

  return safeCount;
}

function printPositions(map) {
  // return;
  let xGrid = new Array(10);
  let yGrid = new Array(10);
  for (let i = 0; i < xGrid.length; i++) {
    xGrid[i] = new Array(10).fill(' ');
    yGrid[i] = new Array(10).fill(' ');
  }

  for (let [key, positions] of map) {
    for (let position of positions) {
      let [x, y, z] = position.split(',');
      xGrid[z][x] = key;
      yGrid[z][y] = key;
    }
  }

  for (let row of xGrid.reverse()) {
    console.log(row.join(''));
  }

  for (let row of yGrid.reverse()) {
    console.log(row.join(''));
  }
}

function checkIntegrity(positionMap) {
  for (let [key, positions] of positionMap) {
    let cached = positionMap.get(key);
    positionMap.delete(key);
    let allPositions = new Set(Array.from(positionMap.values()).flat());

    for (let position of positions) {
      if (allPositions.has(position)) console.log(`${position} exists twice in map`);
    }

    positionMap.set(key, cached);
  }
}

function simulateFallingWithout(removedBrick, bricks, positionMap) {
  let savedPositions = positionMap.get(removedBrick.index)
  positionMap.delete(removedBrick.index);

  for (let brick of bricks) {
    if (brick.index === removedBrick.index) continue;

    let { start, end } = brick;
    let lowestZ = Math.min(start[2], end[2]);
    if (lowestZ === 1) continue;

    let allPositions = new Set(Array.from(positionMap.values()).flat());

    if (brick.orientation === Z) {
      let bottom = (start[2] < end[2]) ? start : end;
      let next = [...bottom];
      next[2]--;
      if (!allPositions.has(next.join())) {
        positionMap.set(removedBrick.index, savedPositions);
        return false;
      }
    } else {
      let positions = positionMap.get(brick.index);
      let nextPositions = positions.map(position => {
        let nextPosition = [...position.split(',')];
        nextPosition[2]--;
        return nextPosition.join();
      });

      // If none of our next positions are currently occupied, commit the negative z transform
      if (!nextPositions.some(pos => allPositions.has(pos))) {
        positionMap.set(removedBrick.index, savedPositions);
        return false;
      }
    }
  }

  positionMap.set(removedBrick.index, savedPositions);
  
  return true;
}

function updateBrickPositions(bricks) {
  let positionMap = new Map;

  for (let brick of bricks) {
    let { start, end } = brick;
    let positions = [];

    switch (brick.orientation) {
      case X:
        let minX = Math.min(start[0], end[0]);
        let maxX = Math.max(start[0], end[0]);

        for (let i = minX; i <= maxX; i++) {
          positions.push([i, start[1], start[2]].join());
        }
        break;
      case Y:
        let minY = Math.min(start[1], end[1]);
        let maxY = Math.max(start[1], end[1]);

        for (let i = minY; i <= maxY; i++) {
          positions.push([start[0], i, start[2]].join());
        }
        break;
      case Z:
        let minZ = Math.min(start[2], end[2]);
        let maxZ = Math.max(start[2], end[2]);

        for (let i = minZ; i <= maxZ; i++) {
          positions.push([start[0], start[1], i].join());
        }
        break;
      case null:
        positions.push(start.join());
        break;
    }

    positionMap.set(brick.index, positions);
  }

  return positionMap;
}

const X = 'X';
const Y = 'Y';
const Z = 'Z';

class Brick {
  constructor(raw, index) {
    this.raw = raw;
    this.index = index;
    this.processRaw();
  }

  processRaw() {
    const { raw } = this;

    let [start, end] = raw.split('~').map((coords) => {
      return coords.split(',').map(coord => parseInt(coord));
    })

    this.start = start;
    this.end = end;
  }

  get orientation() {
    const { start, end } = this;

    if (start[0] !== end[0]) {
      return X;
    } else if (start[1] !== end[1]) {
      return Y;
    } else if (start[2] !== end[2]) {
      return Z;
    } else {
      // Start and end are the same, one cube with nothing to interpolate
      return null;
    }
  }
}

console.log(solution());
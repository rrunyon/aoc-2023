import * as fs from 'fs';
import { PriorityQueue  } from '@datastructures-js/priority-queue';
import { Queue } from '@datastructures-js/queue';

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

  let nextPositions = [];
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
          nextPositions = positions.map(position => {
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
        nextPositions = positions.map(position => {
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

    console.log(`brick ${brick.index} settled at ${brick.start}, ${brick.end}`);
  }

  let { dependsOnMap, dependedOnMap } = buildDependsOnMap(positionMap, bricks);

  /*
  Counting total falling bricks after a disintegration via BFS. Add the disintegrated brick to a queue and visited set.
  While the queue has any values, dequeue bricks and look at the bricks they depend on. If all the bricks they depend
  on are in the visited, set, add the current brick to the visited set and enqueue its neighbors. Count the brick.
  Return the total count.
  */

  return countTotalFallingBricks(dependsOnMap, dependedOnMap, bricks);
}

function countTotalFallingBricks(dependsOnMap, dependedOnMap, bricks) {
  let total = 0;

  for (let brick of bricks) {
    let count = -1;
    let queue = new Queue;
    let disintegrated = new Set;

    queue.enqueue(brick.index);
    disintegrated.add(brick.index);

    while (queue.size()) {
      let brickIndex = queue.dequeue();
      count++;

      let dependedOn = Array.from(dependedOnMap.get(brickIndex) ?? []);

      for (let next of dependedOn) {
        if (disintegrated.has(next)) continue;

        let dependsOn = Array.from(dependsOnMap.get(next));
        if (dependsOn.every(index => disintegrated.has(index))) {
          disintegrated.add(next);
          queue.enqueue(next);
        }
      }
    }

    total += count;
  }

  return total;
}

function buildDependsOnMap(positionMap, bricks) {
  let positionToBrickMap = new Map;
  let brickMap = new Map;

  for (let brick of bricks) {
    brickMap.set(brick.index, brick);
  }

  for (let [key, positions] of positionMap) {
    for (let position of positions) {
      positionToBrickMap.set(position, key);
    }
  }

  let dependsOnMap = new Map;
  let dependedOnMap = new Map;

  for (let brick of bricks) {
    let positions = positionMap.get(brick.index);
    let key = brick.index;
    dependsOnMap.set(key,  new Set);

    if (brick.orientation === Z) {
      let { start, end } = brick;

      let lowestZ = Math.min(start[2], end[2]);
      let nextPosition = [start[0], start[1], lowestZ - 1].join();
      if (positionToBrickMap.has(nextPosition)) {
        let dependedOn = positionToBrickMap.get(nextPosition);
        dependsOnMap.get(key).add(dependedOn);

        if (!dependedOnMap.has(dependedOn)) dependedOnMap.set(dependedOn, new Set);
        dependedOnMap.get(dependedOn).add(key);
      }
    } else {
      for (let position of positions) {
        let nextPosition = position.split(',');
        nextPosition[2]--;
        nextPosition = nextPosition.join();
        
        if (positionToBrickMap.has(nextPosition)) {
          let dependedOn = positionToBrickMap.get(nextPosition);
          dependsOnMap.get(key).add(dependedOn);

          if (!dependedOnMap.has(dependedOn)) dependedOnMap.set(dependedOn, new Set);
          dependedOnMap.get(dependedOn).add(key);
        }
      }
    }
  }

  return { dependsOnMap, dependedOnMap };
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
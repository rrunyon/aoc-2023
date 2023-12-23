import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./22/test-input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let bricks = input.map((row, i) => new Brick(row, i));
  let positionMap = updateBrickPositions(bricks);

  // From the bottom up, compute bricks falling until stabilized
  for (let i = 2; i < 100; i++) {
    for (let brick of bricks) {
      let allPositions = new Set(Array.from(positionMap.values()).flat());

      let { start, end } = brick;

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
        }
      } else {
        if (Math.min(start[2], end[2]) === i) {
          let positions = positionMap.get(brick.index);
          let nextPositions = positions.map(position => {
            let nextPosition = [...position.split(',')];
            nextPosition[2]--;
            return nextPosition.join();
          });

          // If none of our next positions are currently occupied, commit the negative z transform
          if (!nextPositions.some(pos => allPositions.has(pos))) {
            positionMap.set(brick.index, nextPositions);
            brick.start[2]--;
            brick.end[2]--;
          }
        }
      }
    }
  }

  return 0;
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
        positions.push(start);
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
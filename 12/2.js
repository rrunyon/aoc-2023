import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./11/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let universe = input.map(row => row.split(''));
  let expansions = getExpansions(universe);
  let galaxyPositions = getGalaxyPositions(universe);

  let sum = 0;
  for (let i = 0; i < galaxyPositions.length; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      let galaxy1 = galaxyPositions[i];
      let galaxy2 = galaxyPositions[j];
      let xDiff = Math.abs(galaxy1[0] - galaxy2[0]);
      let yDiff = Math.abs(galaxy1[1] - galaxy2[1]);

      let minI = Math.min(galaxy1[0], galaxy2[0]);
      let maxI = Math.max(galaxy1[0], galaxy2[0]);
      for (let i = minI; i < maxI; i++) {
        if (expansions.get('horizontal').has(i)) sum += (1000000 - 1)
      }

      let minJ = Math.min(galaxy1[1], galaxy2[1]);
      let maxJ = Math.max(galaxy1[1], galaxy2[1]);
      for (let i = minJ; i < maxJ; i++) {
        if (expansions.get('vertical').has(i)) sum += (1000000 - 1)
      }

      sum += xDiff + yDiff;
    }
  }

  return sum;
}

function getGalaxyPositions(universe) {
  let positions = [];

  for (let i = 0; i < universe.length; i++) {
    for (let j = 0; j < universe[0].length; j++) {
      if (universe[i][j] === '#') positions.push([i, j]);
    }
  }

  return positions;
}

function getExpansions(universe) {
  let map = new Map;
  map.set('vertical', new Set);
  map.set('horizontal', new Set);

  // Vertically
  for (let i = 0; i < universe[0].length; i++) {
    let empty = true;

    for (let j = 0; j < universe.length; j++) {
      let cell = universe[j][i];
      if (cell === '#') {
        empty = false;
        break;
      }
    }

    if (empty) {
      map.get('vertical').add(i);
    }
  }

  // Horizontally
  for (let i = 0; i < universe.length; i++) {
    let empty = true;

    for (let j = 0; j < universe[0].length; j++) {
      let cell = universe[i][j];
      if (cell === '#') {
        empty = false;
        break;
      }
    }

    if (empty) {
      map.get('horizontal').add(i);
    }
  }

  return map;
}

console.log(solution());
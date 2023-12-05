import * as fs from 'fs';

// Traverse the grid left -> right, top -> bottom. When a digit is encountered, start collecting the number into a string until we reach a non-numerical character or the end of the row.
// While collecting the number, explore the 8 directionally adjacent cells for a gear symbol ('*'). If the number is a gear, add it to a hashmap where the key is the coordinates of the gear,
// and the value is the number. When we are done traversing the grid, process the hashmap by looking for gears with exactly two matching numbers, multiplying those together to get the
// gear ratio, and add that number to a global sum.
function solution() {
  let input = fs.readFileSync('./03/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let gearMap = new Map;

  for (let i = 0; i < input.length; i++) {
    let currentNumber = '';
    let gearPosition = [];

    for (let j = 0; j < input[0].length; j++) {
      let char = input[i][j];
      let parsed = parseInt(char);

      if (!isNaN(parsed)) {
        currentNumber += char;
         if (!gearPosition.length) gearPosition = getGearPosition(input, [i, j]);
      } else if (currentNumber.length) {
        if (gearPosition.length) {
          let key = gearPosition.join();
          if (!gearMap.has(key)) gearMap.set(key, []);
          gearMap.get(key).push(parseInt(currentNumber));
        }
        currentNumber = '';
        gearPosition = [];
      }
    }

    // Handle the end of the row
    if (currentNumber.length && gearPosition.length) {
      let key = gearPosition.join();
      if (!gearMap.has(key)) gearMap.set(key, []);
      gearMap.get(key).push(parseInt(currentNumber));
    }
  }

  let sum = 0;

  for (let [_position, values] of gearMap) {
    if (values.length === 2) {
      sum += values[0] * values[1];
    }
  }

  return sum;
}

function getGearPosition(grid, [i, j]) {
  let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (let dir of dirs) {
    let newI = i + dir[0];
    let newJ = j + dir[1];

    if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && grid[newI][newJ] === '*') {
      return [newI, newJ];
    }
  }

  return [];
}

console.log(solution());

import * as fs from 'fs';

// Traverse the grid left -> right, top -> bottom. When a digit is encountered, start collecting the number into a string until we reach a non-numerical character or the end of the row.
// While collecting the number, explore the 8 directionally adjacent cells for a symbol (non-numeric, non-. character), and track whether we've seen one or not. When the number is fully
// collected, add it to a global sum only if we saw a special symbol. Return the sum.
function solution() {
  let input = fs.readFileSync('./03/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let specialCharacters = collectSpecialCharacters(input);

  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    let currentNumber = '';
    let isPartNumber = false;

    for (let j = 0; j < input[0].length; j++) {
      let char = input[i][j];
      let parsed = parseInt(char);

      if (!isNaN(parsed)) {
        currentNumber += char;
        if (checkAdjacentCells(input, specialCharacters, [i, j])) isPartNumber = true;
      } else if (currentNumber.length) {
        if (isPartNumber) sum += parseInt(currentNumber);
        currentNumber = '';
        isPartNumber = false;
      }
    }

    // Handle the end of the row
    if (currentNumber.length) {
      if (isPartNumber) sum += parseInt(currentNumber);
      currentNumber = '';
      isPartNumber = false;
    }
  }

  return sum;
}

function collectSpecialCharacters(input) {
  let excludedChars = new Set('0123456789.'.split(''))
  let characters = new Set;

  for (let row of input) {
    for (let char of row) {
      if (!excludedChars.has(char)) characters.add(char);
    }
  }

  return characters;
}

function checkAdjacentCells(grid, specialCharacters, [i, j]) {
  let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (let dir of dirs) {
    let newI = i + dir[0];
    let newJ = j + dir[1];

    if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length && specialCharacters.has(grid[newI][newJ])) {
      return true;
    }
  }

  return false;
}

console.log(solution());

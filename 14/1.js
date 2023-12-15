import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./14/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');


  let grid = parseGrid(input);
  tiltNorth(grid);
  return countTotalLoad(grid);
}

function parseGrid(input) {
  let grid = [];
  for (let row of input) {
    grid.push(row.split(''));
  }

  return grid;
}

function tiltNorth(grid) {
  for (let i = 1; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let cell = grid[i][j];

      if (cell === 'O') {
        let k = i;
        let aboveCell = grid[k-1][j];
        while (aboveCell === '.') {
          grid[k-1][j] = 'O';
          grid[k][j] = '.';

          k--;

          if (k === 0) break;
          aboveCell = grid[k-1][j];
        }
      }
    }
  }
}

function countTotalLoad(grid) {
  let sum = 0; 

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let cell = grid[i][j];

      if (cell === 'O') {
        sum += grid.length - i;
      }
    }
  }

  return sum;
}

console.log(solution());
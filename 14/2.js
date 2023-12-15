import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./14/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = parseGrid(input);

  let cycles = 1000
  for (let i = 0; i < cycles; i++) {
    tiltNorth(grid);
    tiltWest(grid);
    tiltSouth(grid);
    tiltEast(grid);
  }

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
      if (i === 0) continue;

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

function tiltWest(grid) {
  for (let j = 1; j < grid[0].length; j++) {
    for (let i = 0; i < grid.length; i++) {
      if (j === 0) continue;

      let cell = grid[i][j];

      if (cell === 'O') {
        let k = j;
        let aboveCell = grid[i][k-1];
        while (aboveCell === '.') {
          grid[i][k-1] = 'O';
          grid[i][k] = '.';

          k--;

          if (k === 0) break;
          aboveCell = grid[i][k-1];
        }
      }
    }
  }
}

function tiltSouth(grid) {
  for (let i = grid.length - 1; i >= 0; i--) {
    for (let j = 0; j < grid[0].length; j++) {
      if (i === grid.length - 1) continue;

      let cell = grid[i][j];

      if (cell === 'O') {
        let k = i;
        let aboveCell = grid[k+1][j];
        while (aboveCell === '.') {
          grid[k+1][j] = 'O';
          grid[k][j] = '.';

          k++;

          if (k === grid.length - 1) break;
          aboveCell = grid[k+1][j];
        }
      }
    }
  }
}

function tiltEast(grid) {
  for (let j = grid[0].length - 2; j >= 0; j--) {
    for (let i = 0; i < grid.length; i++) {
      if (j === grid[0].length - 1) continue;

      let cell = grid[i][j];

      if (cell === 'O') {
        let k = j;
        let aboveCell = grid[i][k+1];
        while (aboveCell === '.') {
          grid[i][k+1] = 'O';
          grid[i][k] = '.';

          k++;

          if (k === 0) {
            break;
          }
          aboveCell = grid[i][k+1];
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
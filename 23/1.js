import * as fs from 'fs';

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function solution() {
  let input = fs.readFileSync('./23/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let grid = input.map(row => row.split(''));
  let start = getStart(grid);

  let maxSteps = -Infinity;
  let visiting = new Set;
  visiting.add(start.join());
  dfs(start[0], start[1], visiting);

  function dfs(i, j, visiting) {
    let cell = grid[i][j];

    if (i === grid.length - 1 && cell === '.') {
      printGrid(grid, visiting);
      maxSteps = Math.max(maxSteps, visiting.size - 1);
      return;
    }

    if (cell === '>') {
      let newKey = [i, j + 1].join();
      if (!visiting.has(newKey)) {
        visiting.add(newKey);
        dfs(i, j + 1, visiting);
        visiting.delete(newKey);
      }
    } else if (cell === 'v') {
      let newKey = [i + 1, j].join();
      if (!visiting.has(newKey)) {
        visiting.add(newKey);
        dfs(i + 1, j, visiting);
        visiting.delete(newKey);
      }
    } else if (cell === '<') {
      let newKey = [i, j - 1].join();
      if (!visiting.has(newKey)) {
        visiting.add(newKey);
        dfs(i, j - 1, visiting);
        visiting.delete(newKey);
      }
    } else if (cell === '^') {
      let newKey = [i - 1, j].join();
      if (!visiting.has(newKey)) {
        visiting.add(newKey);
        dfs(i - 1, j, visiting);
        visiting.delete(newKey);
      }
    } else {
      for (let dir of DIRS) {
        let newI = i + dir[0];
        let newJ = j + dir[1];
        let newKey = [newI, newJ].join();

        if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[0].length) {
          let newCell = grid[newI][newJ];

          if (newCell !== '#' && !visiting.has(newKey)) {
            visiting.add(newKey);
            dfs(newI, newJ, visiting);
            visiting.delete(newKey);
          }
        }
      }
    }
  }

  return maxSteps;
}

function printGrid(grid, visiting) {
  console.log('---------------------------');
  console.log();
  console.log(visiting.size);
  for (let i = 0; i < grid.length; i++) {
    let row = [];
    for (let j = 0; j < grid[0].length; j++) {
      if (visiting.has([i, j].join())) {
        row.push('O');
      } else {
        row.push(grid[i][j]);
      }
    }

    console.log(row.join(''));
  }
}

function getStart(grid) {
  for (let i = 0; i < grid[0].length; i++) {
    if (grid[0][i] === '.') return [0, i];
  }
}

console.log(solution());
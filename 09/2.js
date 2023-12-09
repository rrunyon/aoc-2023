import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./09/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let sum = 0;

  for (let row of input) {
    let history = row.split(' ').map(number => parseInt(number));

    let levels = [history];
    let currentLevel = history;

    while (levels[levels.length - 1].some(el => el !== 0)) {
      let nextLevel = [];

      for (let i = 1; i < currentLevel.length; i++) {
        let prev = currentLevel[i - 1];
        let next = currentLevel[i];

        nextLevel.push(next - prev);
      }

      levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    for (let i = levels.length - 3; i >= 0; i--) {
      let previousLevel = levels[i + 1];
      let level = levels[i];

      level.unshift(level[0] - previousLevel[0]);
    }

    sum += levels[0][0];
  }

  return sum;
}

console.log(solution());
import * as fs from 'fs';

const BAG = {
  red: 12,
  green: 13,
  blue: 14,
};

function solution() {
  let input = fs.readFileSync('./02/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let sum = 0;

  for (const line of input) {
    if (!line) continue;

    let skip = false;

    let [left, right] = line.split(': ');
    let gameNumber = left.split(' ')[1];

    let games = right.split('; ');
    for (const game of games) {
      let cubes = game.split(', ');
      for (let cube of cubes) {
        let [number, color] = cube.split(' ');
        number = parseInt(number);
        if (BAG[color] < number) skip = true;
      }
    }

    if (!skip) sum += parseInt(gameNumber);
  }

  return sum;
};

console.log(solution());

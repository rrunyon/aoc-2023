import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./02/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let sum = 0;

  for (const line of input) {
    if (!line) continue;

    let [_left, right] = line.split(': ');
    let map = new Map;

    let games = right.split('; ');
    for (const game of games) {
      let cubes = game.split(', ');

      for (let cube of cubes) {
        let [number, color] = cube.split(' ');

        if (!map.has(color)) map.set(color, number);
        map.set(color, Math.max(map.get(color), number));
      }
    }

    let power = 1;
    for (let [_color, number] of map) {
      power *= number;
    }

    sum += power;
  }

  return sum;
};

console.log(solution());

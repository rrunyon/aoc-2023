import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./15/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let steps = input[0].split(',');

  let sum = 0;
  for (let step of steps) {
    let currentValue = 0;

    for (let char of step) {
      let asciiCode = char.charCodeAt();

      currentValue += asciiCode;
      currentValue *= 17;
      currentValue = currentValue % 256;
    }

    sum += currentValue;
  }

  return sum;
}

console.log(solution());
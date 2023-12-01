import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./01/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let sum = 0;

  for (let line of input) {
    if (!line) continue;

    line = line.replaceAll(/[a-z]*/gi, '')
    sum += parseInt(line[0] + line[line.length - 1]);
  }

  return sum;
}

console.log(solution());

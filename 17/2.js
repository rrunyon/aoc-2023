import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./16/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
}

console.log(solution());
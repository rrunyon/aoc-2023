import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./04/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  
  let sum = 0;

  for (let row of input) {
    let [left, right] = parseRow(row);
    let winningNumbers = new Set(left);
    let winningNumberCount = 0;

    for (let number of right) {
      if (winningNumbers.has(number)) winningNumberCount++;
    }

    if (winningNumberCount === 1) {
      sum += 1
    } else if (winningNumberCount > 1) {
      let totalScore = 1;
      for (let i = 1; i < winningNumberCount; i++) {
        totalScore *= 2;
      }

      sum += totalScore
    }
  }


  return sum;
}

function parseRow(row) {
  return row
    .split(': ')[1]
    .split(' | ')
    .map(numbers => {
      return numbers
        .split(' ')
        .map(number => parseInt(number))
        .filter(number => !!number)
    });
}

console.log(solution());

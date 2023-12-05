import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./04/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let winningCountMap = new Map;
  for (let i = 0; i < input.length; i++) {
    let row = input[i];
    let [left, right] = parseRow(row);
    let winningNumbers = new Set(left);
    let winningNumberCount = 0;

    for (let number of right) {
      if (winningNumbers.has(number)) winningNumberCount++;
    }

    winningCountMap.set(i, winningNumberCount);
  }

  return countWinners(input, winningCountMap);
}

function countWinners(cards, winningCountMap, index = 0, depth = 0) {
  if (index >= cards.length) return 0;

  let winningNumberCount = winningCountMap.get(index);

  let count = 1;
  if (winningNumberCount > 0) {
    for (let i = 1; i <= winningNumberCount; i++) {
      count += countWinners(cards, winningCountMap, index + i, depth + 1);
    }
  }

  if (depth > 0) {
    return count;
  } else {
    return count + countWinners(cards, winningCountMap, index + 1);
  }
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
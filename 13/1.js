import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./13/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let patterns = [];
  let pattern = [];
  for (let row of input) {
    if (row.length === 0) {
      patterns.push(pattern);
      pattern = [];
    } else {
      pattern.push(row);
    }
  }
  patterns.push(pattern);

  let sum = 0;
  for (let pattern of patterns) {
    let vertical = getVerticalLine(pattern);
    let horizontal = getHorizontalLine(pattern);

    sum += vertical + (100 * horizontal);
  }

  return sum;
}

function getHorizontalLine(pattern) {
  for (let i = 0; i < pattern.length - 1; i++) {
    let top = i;
    let bottom = i + 1;
    let mirror = true;

    while (top >= 0 && top < pattern.length && bottom >= 0 && bottom < pattern.length) {
      let topRow = pattern[top];
      let bottomRow = pattern[bottom];

      if (topRow !== bottomRow) {
        mirror = false;
        break;
      } else {
        top--;
        bottom++;
      }
    }

    if (mirror) return i + 1;
  }

  return 0;
}

function getVerticalLine(pattern) {
  for (let i = 0; i < pattern[0].length - 1; i++) {
    let left = i;
    let right = i + 1;
    let mirror = true;

    while (left >= 0 && left < pattern[0].length && right >= 0 && right < pattern[0].length) {
      let leftColumn = [];
      for (let j = 0; j < pattern.length; j++) {
        leftColumn.push(pattern[j][left]);
      }

      let rightColumn = [];
      for (let j = 0; j < pattern.length; j++) {
        rightColumn.push(pattern[j][right]);
      }

      if (leftColumn.join('') !== rightColumn.join('')) {
        mirror = false;
        break;
      } else {
        left--;
        right++;
      }
    }

    if (mirror) return i + 1;
  }

  return 0;
}

console.log(solution());
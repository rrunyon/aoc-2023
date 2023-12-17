import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./12/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let sum = 0;
  for (let row of input) {
    let [gears, counts] = row.split(' ');
    gears = gears.split('');
    counts = counts.split(',').map(count => parseInt(count));

    let expandedGears = gears;
    let expandedCounts = counts;

    for (let i = 0; i < 4; i++) {
      expandedGears = [...expandedGears, '?', ...gears];
      expandedCounts = [...expandedCounts, ...counts];
    }
    let configurations = getPossibleConfigurations(expandedGears, expandedCounts);
    sum += configurations;
  }

  return sum;
}

function getPossibleConfigurations(gears, counts, memo = new Map) {
  let key = [gears, counts].join();
  if (memo.has(key)) return memo.get(key);

  if (gears.length === 0 && counts.length === 0) {
    return 1;
  } else if (gears.length === 0 && counts.length > 0) {
    return 0;
  } else if (gears.length > 0 && counts.length === 0) {
    return gears.every(gear => gear === '?' || gear === '.') ? 1 : 0;
  }

  let left = 0;
  let right = 0;
  if (gears[0] === '.' || gears[0] === '?') {
    left = getPossibleConfigurations(gears.slice(1), counts, memo);
  }

  if (gears[0] === '#' || gears[0] === '?') {
    let currentCount = counts[0];

    let stop = false;
    for (let i = 0; i < currentCount; i++) {
      if (gears[i] === '.') {
        stop = true;
        break;
      }
    }

    if (stop || currentCount > gears.length || gears[currentCount] === '#') {
      right = 0;
    } else if (gears[currentCount] === '.') {
      right = getPossibleConfigurations(gears.slice(currentCount), counts.slice(1), memo);
    } else {
      right = getPossibleConfigurations(gears.slice(currentCount + 1), counts.slice(1), memo);
    }
  }

  let result = left + right;
  memo.set(key, result);

  return result;
}

console.log(solution());
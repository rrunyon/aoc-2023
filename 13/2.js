import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./12/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let sum = 0;
  for (let row of input) {
    console.log('---------------');
    console.log(row);

    let [gears, counts] = row.split(' ');
    gears = gears.split('');
    counts = counts.split(',').map(count => parseInt(count));

    let expandedGears = [];
    let expandedCounts = [];

    for (let i = 0; i < 5; i++) {
      expandedGears = [...expandedGears, ...gears];
      expandedCounts = [...expandedCounts, ...counts];
    }
    sum += getPossibleConfigurations(expandedGears, expandedCounts);
  }

  return sum;
}

function getPossibleConfigurations(gears, counts, gearI = 0) {
  if (gearI === gears.length) {
    return isValidConfiguration(gears, counts) ? 1 : 0;
  }

  let char = gears[gearI];

  if (char === '.' && !isValidSegment(gears.slice(0, gearI + 1), counts)) {
    return 0;
  } else if (char === '?') {
    gears[gearI] = '.';
    let left = getPossibleConfigurations(gears, counts, gearI + 1)
    gears[gearI] = '#';
    let right = getPossibleConfigurations(gears, counts, gearI + 1)
    gears[gearI] = '?';

    return left + right;
  } else {
    return getPossibleConfigurations(gears, counts, gearI + 1);
  }
}

function isValidSegment(gears, counts) {
  let countI = 0;

  let currentGearLength = 0;
  for (let i = 0; i < gears.length; i++) {
    let char = gears[i];
    if (char === '.') {
      if (currentGearLength > 0 && currentGearLength !== counts[countI]) {
        return false;
      } else if (currentGearLength > 0 && currentGearLength === counts[countI]) {
        countI++;
      }

      currentGearLength = 0;
    } else {
      currentGearLength++;
    }
  }

  return true;
}

function isValidConfiguration(gears, counts) {
  let countI = 0;

  let currentGearLength = 0;
  for (let i = 0; i < gears.length; i++) {
    let char = gears[i];
    if (char === '.') {
      if (currentGearLength > 0 && currentGearLength !== counts[countI]) {
        return false;
      } else if (currentGearLength > 0 && currentGearLength === counts[countI]) {
        countI++;
      }

      currentGearLength = 0;
    } else {
      currentGearLength++;
    }
  }

  if (countI === counts.length && currentGearLength === 0) return true;
  if (countI === counts.length - 1 && currentGearLength === counts[countI]) return true;

  return false;
}

console.log(solution());
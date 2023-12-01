import * as fs from 'fs';

let numberMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

let values = [...Object.keys(numberMap), ...Object.values(numberMap)];

function solution() {
  let input = fs.readFileSync('./01/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  let sum = 0;

  // For each line, check for the first/last index of all known values and load them 
  // into a map of index => value. Then get the min and max index from the map and
  // use that to build our number
  for (let line of input) {
    if (!line) continue;

    let indexMap = {};
    for (let value of values) {
      let firstIndex = line.indexOf(value);
      let lastIndex = line.lastIndexOf(value);

      for (let index of [firstIndex, lastIndex]) {
        if (index !== -1) {
          if (numberMap.hasOwnProperty(value)) {
            indexMap[index] = numberMap[value];
          } else {
            indexMap[index] = value;
          }
        }
      }
    }

    let first = indexMap[Math.min(...Object.keys(indexMap))];
    let last = indexMap[Math.max(...Object.keys(indexMap))];

    sum += parseInt(first + last);
  }

  return sum;
}

console.log(solution());

import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./06/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  
  let time;
  let distance;
  
  for (let row of input) {
    if (row.startsWith('Time')) {
      time = parseInt(row.split(':')[1].replaceAll(' ', ''));
    } else if (row.startsWith('Distance')) {
      distance = parseInt(row.split(':')[1].replaceAll(' ', ''));
    }
  }

  let localSum = 0;
  let speed = 0;
  for (let i = 1; i <= time; i++) {
    speed++;
    let currentRace = speed * (time - i);
    if (currentRace > distance) localSum++;
  }

  return localSum;
}


console.log(solution());
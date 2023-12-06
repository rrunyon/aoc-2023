import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./06/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');
  
  let times = [];
  let distances = [];
  
  for (let row of input) {
    if (row.startsWith('Time')) {
      times = row.split(':')[1].split(' ').map(time => parseInt(time)).filter(time => !!time);
    } else if (row.startsWith('Distance')) {
      distances = row.split(':')[1].split(' ').map(distance => parseInt(distance)).filter(distance => !!distance);
    }
  }

  let product = 1;

  for (let i = 0; i < times.length; i++) {
    let time = times[i];
    let distance = distances[i];

    let localSum = 0;
    let speed = 0;
    for (let i = 1; i <= time; i++) {
      speed++;
      let currentRace = speed * (time - i);
      if (currentRace > distance) localSum++;
    }

    product *= localSum;
  }

  return product;
}


console.log(solution());
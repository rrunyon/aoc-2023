import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./15/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let steps = input[0].split(',');
  let boxes = new Array(256);

  for (let i = 0; i < boxes.length; i++) {
    boxes[i] = new Box;
  }

  for (let step of steps) {
    let [label, operation, focalLength] = parse(step);
    let hash = getHash(label);
    let box = boxes[hash];

    if (operation === '=') {
      box.addLens(label, parseInt(focalLength));
    } else if (operation === '-') {
      box.removeLens(label);
    }
  }

  let focusingPower = 0;
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    let baseFocusingPower = i + 1;

    let slotNumber = 1;
    for (let lens of box.lenses) {
      if (lens) {
        focusingPower += baseFocusingPower * slotNumber++ * lens.focalLength;
      }
    }
  }

  return focusingPower;
}

function getHash(string) {
  let currentValue = 0;

  for (let char of string) {
    let asciiCode = char.charCodeAt();

    currentValue += asciiCode;
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}

function parse(step) {
  let label;
  let operation;
  let focalLength;

  if (step.includes('=')) {
    [label, focalLength] = step.split('=');
    operation = '=';
  } else if (step.includes('-')) {
    [label] = step.split('-');
    operation = '-';
  }

  return [label, operation, focalLength];
}

class Box {
  constructor() {
    this.lenses = [];
    this.lensMap = new Map;
  }

  addLens(label, focalLength) {
    if (this.lensMap.has(label)) {
      let index = this.lensMap.get(label);
      let currentLens = this.lenses[index];
      this.lenses[index] = { ...currentLens, focalLength };
    } else {
      this.lenses.push({ label, focalLength });
      this.lensMap.set(label, this.lenses.length - 1);
    }
  }

  removeLens(label) {
    if (this.lensMap.has(label)) {
      let index = this.lensMap.get(label);
      this.lenses[index] = undefined;
      this.lensMap.delete(label);
    }
  }
}

console.log(solution());
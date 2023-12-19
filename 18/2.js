import { Queue } from '@datastructures-js/queue';
import * as fs from 'fs';

const DIRS = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
}

function solution() {
  let input = fs.readFileSync('./18/test-input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let instructions = input.map(parseInstruction2);
  let points = getPoints(instructions);
  let interiorPointsCount = shoelace(points);
  return getArea(interiorPointsCount, points);
}

function getPoints(instructions) {
  let startI = 0;
  let startJ = 0;
  let currentPosition = [startI, startJ];

  let points = [];
  for (let [direction, distance] of instructions) {
    let [i, j] = currentPosition;
    let newI = i + (direction[0] * distance);
    let newJ = j + (direction[1] * distance);

    points.push([newI, newJ]);
  }

  return points;
}

function shoelace(points) {
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    let p = i ? points[i - 1] : points[points.length - 1];
    let q = points[i];
    sum += (p[0] - q[0]) * (p[1] + q[1]);
  }

  return Math.abs(sum) / 2;
}

function getArea(interiorPointsCount, points) {
  return interiorPointsCount + (points.length / 2) + 1;
}

function parseInstruction(row) {
  let [, , hex] = row.split(' ');

  hex = hex.slice(2, hex.length - 1);
  let direction = DIRS[Object.keys(DIRS)[hex[hex.length - 1]]];
  let distance = parseInt(hex.slice(0, hex.length - 1), 16);

  return [direction, distance, hex];
}

function parseInstruction2(row) {
  let [direction, distance, hex] = row.split(' ');

  direction = DIRS[direction];
  distance = parseInt(distance);

  return [direction, distance, hex];
}

function dig(instructions) {
  let startI = 0;
  let startJ = 0;
  let currentPosition = [startI, startJ];

  let map = new Map;
  for (let [direction, distance] of instructions) {
    for (let i = 0; i < distance; i++) {
      let [i, j] = currentPosition;
      let nextI = i + direction[0];
      let nextJ = j + direction[1];
      if (!map.has(nextI)) map.set(nextI, [])

      map.get(nextI).push(nextJ);
      currentPosition = [nextI, nextJ];
    }
  }

  return map;
}

function countTrenchArea(map) {
  let sum = 0;

  for (let [_key, values] of map) {
    values.sort();

    for (let i = 1; i < values.length; i++) {
      if (i % 1 === 0) {
        let left = values[i - 1];
        let right = values[1];
        sum += Math.abs(left - right);
      }
    }
  }

  return sum;
}

console.log(solution());
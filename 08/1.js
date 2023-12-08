import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./08/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let instructions = input[0];

  let nodes = new Map;
  for (let row of input.slice(2)) {
    let [value, children] = row.split(' = ');
    let [left, right] = children.slice(1, children.length - 1).split(', ');

    nodes.set(value, { value, left, right });
  }

  for (let [_value, node] of nodes) {
    let { left, right } = node;
    node.left = nodes.get(left);
    node.right = nodes.get(right);
  }

  const START = 'AAA';
  const END = 'ZZZ';

  let currentNode = nodes.get(START);
  let steps = 0;

  while (currentNode.value !== END) {
    let instruction = instructions[steps % instructions.length];
    steps++;

    currentNode = instruction === 'L' ? currentNode.left : currentNode.right;
  }

  return steps;
}

console.log(solution());
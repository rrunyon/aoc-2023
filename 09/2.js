import * as fs from 'fs';
import { Queue } from '@datastructures-js/queue';

/*
Least common multiple. Traverse through the graph until we collect a map of 6 unique Z nodes with the number of
steps required to reach them. Then compute the LCM of all the steps for each node, which gives us the number of
steps at which we will reach all 6 at the same time.
*/
function solution() {
  let input = fs.readFileSync('./08/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let instructions = input[0];

  let nodes = new Map;
  for (let row of input.slice(2)) {
    let [value, children] = row.split(' = ');
    let [left, right] = children.slice(1, children.length - 1).split(', ');

    nodes.set(value, { value, left, right });
  }

  let currentNodes = [];
  for (let [value, node] of nodes) {
    if (value.endsWith('A')) currentNodes.push(node);

    let { left, right } = node;
    node.left = nodes.get(left);
    node.right = nodes.get(right);
  }

  let zNodeMap = new Map;
  let steps = 0;
  while (zNodeMap.size < currentNodes.length) {
    let nextNodes = [];
    let instruction = instructions[steps % instructions.length];

    for (let node of currentNodes) {
      let nextNode = instruction === 'L' ? node.left : node.right;
      nextNodes.push(nextNode);

      if (nextNode.value.endsWith('Z')) {
        zNodeMap.set(nextNode.value, steps + 1);
      }
    }

    currentNodes = nextNodes;
    steps++;
  }

  return Array.from(zNodeMap.values()).reduce((prev, curr) => {
    return prev * curr / gcd(prev, curr);
  }, 1);
}

function gcd(a, b) { 
  if (a == 0) return b; 

  return gcd(b % a, a); 
} 

console.log(solution());
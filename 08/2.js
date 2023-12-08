import * as fs from 'fs';
import { Queue } from '@datastructures-js/queue';

/*
Breadth first search: While parsing input and constructing the graph, collect all nodes ending with 'A' in a queue. 
Use this queue as our starting point for DFS. During each level of traversal, track whether all nodes in the current
level end in Z, and if they do return the depth of the traversal.
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

  let queue = new Queue;
  for (let [value, node] of nodes) {
    if (value.endsWith('A')) queue.enqueue(node);

    let { left, right } = node;
    node.left = nodes.get(left);
    node.right = nodes.get(right);
  }

  let steps = 0;
  while (queue.size()) {
    let size = queue.size();
    let instruction = instructions[steps % instructions.length];
    let isAllZ = true;

    console.log('---------------------------');
    console.log('depth: ', steps);
    console.log('size: ', size);

    for (let i = 0; i < size; i++) {
      let currentNode = queue.dequeue();
      let nextNode = instruction === 'L' ? currentNode.left : currentNode.right;
      queue.enqueue(nextNode);

      if (!nextNode.value.endsWith('Z')) isAllZ = false;
    }

    steps++;
    if (isAllZ) return steps;
  }
}

console.log(solution());
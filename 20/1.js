import { Queue } from '@datastructures-js/queue';
import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./20/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let modules = parseModules(input);

  let totalLowCount = 0;
  let totalHighCount = 0;

  for (let i = 0; i < 1000; i++) {
    let { lowCount, highCount } = cycle(modules);
    totalLowCount += lowCount;
    totalHighCount += highCount;
  }

  return totalLowCount * totalHighCount;
}

function parseModules(input) {
  let modules = new Map;
  for (let row of input) {
    let [label, outputs] = row.split(' -> ');
    outputs = outputs.split(', ');
    let key;
    let module;

    if (label.startsWith('%')) {
      key = label.slice(1);
      module = new FlipFlop(outputs);
    } else if (label.startsWith('&')) {
      key = label.slice(1);
      module = new Conjunction([], outputs);
    } else if (label.startsWith('broadcaster')) {
      key = 'broadcaster';
      module = new Broadcaster(outputs);
    }

    modules.set(key, module);
  }

  updateAllInputs(modules);
  return modules;
}

function updateAllInputs(modules) {
  for (let [key, module] of modules) {
    let { outputs } = module;

    for (let output of outputs) {
      let destinationModule = modules.get(output);
      if (!destinationModule) continue;

      destinationModule.inputs.push(key);
    }
  }
}

function cycle(modules) {
  let lowCount = 0;
  let highCount = 0;

  let queue = new Queue;
  queue.enqueue({ pulse: LOW, moduleKey: 'broadcaster' });

  while (queue.size()) {
    let size = queue.size();

    for (let i = 0; i < size; i++) {
      let { pulse, lastKey, moduleKey } = queue.dequeue();
      pulse === LOW ? lowCount++ : highCount++;

      let module = modules.get(moduleKey);
      if (!module) continue;

      module.receivePulse(pulse, lastKey);

      switch (module.constructor.name) {
        case 'Broadcaster':
          for (let output of module.outputs) {
            queue.enqueue({ pulse, lastKey: moduleKey, moduleKey: output })
          }
          break;
        case 'FlipFlop':
          if (pulse === LOW) {
            let nextPulse = module.state === ON ? HIGH : LOW;
            for (let output of module.outputs) {
              queue.enqueue({ pulse: nextPulse, lastKey: moduleKey, moduleKey: output })
            }
          }
          break;
        case 'Conjunction':
          let nextPulse = module.nextPulse;
          for (let output of module.outputs) {
            queue.enqueue({ pulse: nextPulse, lastKey: moduleKey, moduleKey: output })
          }
          break;
      }
    }
  }

  return { lowCount, highCount };
}

class Broadcaster {
  inputs = [];
  outputs = [];

  constructor(outputs) {
    this.outputs = outputs;
  }

  receivePulse() {}
}

const HIGH = 'HIGH';
const LOW = 'LOW';

const OFF = 'OFF';
const ON = 'ON';
class FlipFlop {
  state = OFF;
  inputs = [];
  outputs = [];

  constructor(outputs) {
    this.outputs = outputs;
  }

  receivePulse(pulse) {
    if (pulse === LOW) {
      this.toggleState();
    }
  }

  toggleState() {
    this.state = this.state === OFF ? ON : OFF;
  }
}

class Conjunction {
  memory = new Map;
  inputs = [];
  outputs = [];

  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  receivePulse(pulse, sourceModule) {
    this.memory.set(sourceModule, pulse);
  }

  get nextPulse() {
    const areAllHigh = this.inputs.every(input => {
      return (this.memory.get(input) ?? LOW) === HIGH;
    });

    return areAllHigh ? LOW : HIGH;
  }
}

console.log(solution());
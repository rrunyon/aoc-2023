import * as fs from 'fs';
import _ from 'lodash';

function solution() {
  let input = fs.readFileSync('./19/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let { workflows } = parseInput(input);

  let globalBounds = {
    x: {
      min: 1,
      max: 4000,
    },
    m: {
      min: 1,
      max: 4000,
    },
    a: {
      min: 1,
      max: 4000,
    },
    s: {
      min: 1,
      max: 4000,
    },
  };

  let combinations = 0;
  dfs('in');

  return combinations;

  function dfs(key, bounds = { ...globalBounds }) {
    if (key === 'R') return;

    if (key === 'A') {
      let product = 1;
      for (let [_key, values] of Object.entries(bounds)) {
        let range = values.max - values.min + 1;
        product *= range;
      }

      combinations += product;

      return;
    };

    let workflow = workflows.get(key);

    for (let rule of workflow.rules) {
      // Pass
      if (rule.operator === GREATER_THAN) {
        let newBounds = _.cloneDeep(bounds);
        let currentMin = newBounds[rule.leftOperand].min;
        newBounds[rule.leftOperand].min = Math.max(currentMin, rule.rightOperand + 1);
        dfs(rule.destination, newBounds);
      } else if (rule.operator === LESS_THAN) {
        let newBounds = _.cloneDeep(bounds);
        let currentMax = newBounds[rule.leftOperand].max;
        newBounds[rule.leftOperand].max = Math.min(currentMax, rule.rightOperand - 1);
        dfs(rule.destination, newBounds)
      } else {
        dfs(rule.destination, _.cloneDeep(bounds));
      }


      // Fail
      if (rule.operator === GREATER_THAN) {
        let currentMax = bounds[rule.leftOperand].max;
        bounds[rule.leftOperand].max = Math.min(currentMax, rule.rightOperand);
      } else if (rule.operator === LESS_THAN) {
        let currentMin = bounds[rule.leftOperand].min;
        bounds[rule.leftOperand].min = Math.max(currentMin, rule.rightOperand);
      }
    }
  }
}

function parseInput(input) {
  let workflows = new Map;
  let partsRatings = [];

  let processingWorkflows = true;
  for (let row of input) {
    if (!row) {
      processingWorkflows = !processingWorkflows;
      continue;
    }

    if (processingWorkflows) {
      let workflow = new Workflow(row);
      workflows.set(workflow.key, workflow);
    } else {
      partsRatings.push(new PartsRating(row));
    }
  }

  return { workflows, partsRatings };
}

const LESS_THAN = '<';
const GREATER_THAN = '>';

class Workflow {
  constructor(rawWorkflow) {
    this.rawWorkflow = rawWorkflow;
    this.processWorkflow();
  }

  processWorkflow() {
    const { rawWorkflow } = this;

    let [key, rules] = rawWorkflow.split('{');
    rules = rules.slice(0, rules.length - 1).split(',');

    this.key = key;
    this.rules = rules.map(rule => new Rule(rule));
  }
}

class Rule {
  constructor(rawRule) {
    this.rawRule = rawRule;
    this.processWorkflow();
  }

  processWorkflow() {
    const { rawRule } = this;

    let [check, destination] = rawRule.split(':');
    if (check.includes(GREATER_THAN)) {
      this.operator = GREATER_THAN;
    } else if (check.includes(LESS_THAN)) {
      this.operator = LESS_THAN;
    } else {
      this.destination = rawRule;
      return;
    }

    let [leftOperand, rightOperand] = check.split(this.operator);
    this.leftOperand = leftOperand;
    this.rightOperand = parseInt(rightOperand);
    this.destination = destination;
  }

  evaluate(input) {
    if (this.operator === GREATER_THAN) {
      return input > this.rightOperand;
    } else {
      return input < this.rightOperand;
    }
  }
}

class PartsRating {
  constructor(rawPartsRating) {
    this.rawPartsRating = rawPartsRating;
    this.processPartsRating();
  }

  processPartsRating() {
    let { rawPartsRating } = this;
    rawPartsRating = rawPartsRating.slice(1, rawPartsRating.length - 1);
    let partsRatings = rawPartsRating.split(',');

    this.ratings = partsRatings.reduce((obj, partsRating) => {
      let [category, rating] = partsRating.split('=');
      obj[category] = parseInt(rating);
      return obj;
    }, {})
  }

  get totalRating() {
    return Object.values(this.ratings).reduce((total, rating) => {
      return total + rating;
    }, 0);
  }
}

console.log(solution());
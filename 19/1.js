import * as fs from 'fs';

function solution() {
  let input = fs.readFileSync('./19/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let { workflows, partsRatings } = parseInput(input);

  let sum = 0;
  for (let part of partsRatings) {
    let currentWorkflowKey = 'in';

    while (currentWorkflowKey !== 'A' && currentWorkflowKey !== 'R') {
      let currentWorkflow = workflows.get(currentWorkflowKey);

      for (let i = 0 ; i < currentWorkflow.rules.length; i++) {
        const rule = currentWorkflow.rules[i];

        if (i === currentWorkflow.rules.length - 1) {
          currentWorkflowKey = rule.destination;
        } else {
          let rating = part.ratings[rule.leftOperand];
          let result = rule.evaluate(rating);

          if (result) {
            currentWorkflowKey = rule.destination;
            break;
          }
        }
      }
    }

    if (currentWorkflowKey === 'A') {
      sum += part.totalRating;
    }
  }

  return sum;
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
    this.rules = rules.map(rule =>new Rule(rule));
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
    this.rightOperand = rightOperand;
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
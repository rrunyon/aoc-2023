import * as fs from 'fs';

const CARDS = 'AKQT98765432J'.split('').reduce((prev, curr, i) => {
  prev[curr] = i
  return prev;
}, {});

const FIVE_OF_A_KIND = 0;
const FOUR_OF_A_KIND = 1;
const FULL_HOUSE = 2;
const THREE_OF_A_KIND = 3;
const TWO_PAIR = 4;
const ONE_PAIR = 5;
const HIGH_CARD = 6;

function solution() {
  let input = fs.readFileSync('./07/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let hands = input.map(row => parseRow(row));
  hands.sort(compareHands);

  return hands.reduce((prev, curr, i) => {
    return prev + (curr.bid * (i + 1));
  }, 0);
}

function compareHands(a, b) {
  if (a.type === b.type) {
    for (let i = 0; i < a.hand.length; i++) {
      let aCard = a.hand[i];
      let bCard = b.hand[i];

      if (aCard !== bCard) {
        return CARDS[aCard] > CARDS[bCard] ? -1 : 1;
      }
    }
  } else {
    return a.type > b.type ? -1 : 1;
  }
}

function parseRow(row) {
  let [hand, bid] = row.split(' ');

  let cardFrequencyMap = new Map;
  for (let char of hand) {
    cardFrequencyMap.set(char, (cardFrequencyMap.get(char) || 0) + 1);
  }

  let jokerCount = cardFrequencyMap.get('J');
  // Don't count jacks for the original hand type or they'll be double counted as wildcards.
  // Example: 'J2J3J' will register as three of a kind below, and then get upgraded to 5 of a kind.
  // It should be detected as high card and then upgraded to four of a kind.
  cardFrequencyMap.delete('J');

  let cardCountMap = new Map;
  for (let [_key, value] of cardFrequencyMap) {
    cardCountMap.set(value, (cardCountMap.get(value) || 0) + 1);
  }

  let type;
  if (cardCountMap.has(5)) {
    type = FIVE_OF_A_KIND;
  } else if (cardCountMap.has(4)) {
    type = FOUR_OF_A_KIND;
  } else if (cardCountMap.has(3) && cardCountMap.has(2)) {
    type = FULL_HOUSE;
  } else if (cardCountMap.has(3)) {
    type = THREE_OF_A_KIND;
  } else if (cardCountMap.get(2) === 2) {
    type = TWO_PAIR;
  } else if (cardCountMap.get(2) === 1)  {
    type = ONE_PAIR;
  } else {
    type = HIGH_CARD;
  }

  for (let i = 0; i < jokerCount; i++) {
    if (type === HIGH_CARD) {
      type = ONE_PAIR;
    } else if (type === ONE_PAIR) {
      type = THREE_OF_A_KIND;
    } else if (type === TWO_PAIR) {
      type = FULL_HOUSE;
    } else if (type === THREE_OF_A_KIND || type === FULL_HOUSE) {
      type = FOUR_OF_A_KIND;
    } else if (type === FOUR_OF_A_KIND) {
      type = FIVE_OF_A_KIND;
    }
  }

  bid = parseInt(bid);

  return { type, hand, bid }
}

console.log(solution());
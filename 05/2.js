import * as fs from 'fs';

// Preprocess the input into a nested map with this schema:
// {
//   seed: {
//     soil: [
//       [1, 2, 3]
//       ...
//     ]
//     ...
//   }
//   ...
// }
// Each key has an inner map of the mapping destination, and then the keys/values are the outer/inner type mapping ranges.
// When preprocessing is finished, follow the map values for seed, soil, fertilizer, water, light, temperature, humidity, and location,
// and return the minimum location seen for the input seeds using the ranges captured.
function solution() {
  let input = fs.readFileSync('./05/input.txt', { encoding: 'utf8', flag: 'r' }).split('\n');

  let processedMap = new Map;
  let seedValues = [];

  let sourceMappingKey = undefined;
  let destinationMappingKey = undefined;

  for (let row of input) {
    // Capture seed values
    if (row.startsWith("seeds")) {
      seedValues = row.split(': ')[1].split(' ').map(number => parseInt(number));
    // Capture mapping keys
    } else if (row.includes('map')) {
      let split = row.split('-');
      sourceMappingKey = split[0];
      destinationMappingKey = split[2].split(' ')[0];
    // Capture mapping values
    } else if (sourceMappingKey && destinationMappingKey) {
      let [destination, source, range] = row.split(' ').map(number => parseInt(number));
      if (!processedMap.has(sourceMappingKey)) processedMap.set(sourceMappingKey, new Map);
      let sourceMap = processedMap.get(sourceMappingKey);
      if (!sourceMap.has(destinationMappingKey)) sourceMap.set(destinationMappingKey, []);

      sourceMap.get(destinationMappingKey).push([source, destination, range]);
    // Unset mapping keys when mapping section is done
    } else if (row.length === 0) {
      sourceMappingKey = undefined;
      destinationMappingKey = undefined;
    }
  }

  let keys = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location'].reverse();

  for (let location = 0; location < Infinity; location++) {
    if (location % 1000000 === 0) console.log('location: ', location);

    let value = location;
    for (let i = 1; i < keys.length; i++) {
      let leftKey = keys[i - 1];
      let rightKey = keys[i];
      let ranges = processedMap.get(rightKey).get(leftKey);

      for (let [source, destination, range] of ranges) {
        if (value >= destination && value < destination + range) {
          let delta = value - destination;
          value = source + delta;
          break;
        }
      }
    }

    for (let i = 0; i < seedValues.length; i += 2) {
      let seedValue = seedValues[i];
      let range = seedValues[i + 1];

      if (value >= seedValue && value < seedValue + range) {
        return location;
      }
    }
  }
}

console.log(solution());
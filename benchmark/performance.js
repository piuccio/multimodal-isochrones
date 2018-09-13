/* eslint-disable no-console */
const json = require('./graph.json');
const pretty = require('pretty-ms');
const iso = require('../index');
const { performance } = require('perf_hooks');

const graph = iso();
json.edges.forEach((_) => graph.addEdge(_));

performance.mark('before');
graph.from('node_0').maxTime(60).maxLines(5).get();
performance.mark('after');
performance.measure('query', 'before', 'after');
const timeToQuery = performance.getEntriesByName('query')[0].duration;

console.log(`Graph processed in ${pretty(timeToQuery)}`);

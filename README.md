## multimodal-isochrones

Compute lines of equal travel times (isochrones) in a multimodal transport graph.

Isochrone maps display areas of similar travel time to a selected starting location on the map. There are several algorithms that can be used to compute the minimum travel distance on a graph, however they don't take into account the additional cost of switching traveling mode in a door-to-door approach.

Graphs are usually represented as nodes connected by edges. In a complex transport systems edges can belong to different railway or bus lines and there's usually an additional cost (monetary or travel time) in switching line at any given station (node).

`multimodal-isochrones` finds the shortest path between a node of the graph and any other node taking into account the travel cost and the cost of transfers.

### Node

A `node` is simply represented by a unique String.

For complex transport networks this could be a single station, regardless of the number of lines that crosses it.

### Edge

An `edge` is a direct connection between two nodes (undirected). It's represented by
* `from` the origin node
* `to` the destination node
* `line` the line identifier
* `time` the cost value, the algorithm will try to minimize it



## Populate the graph

```js
const isochrones = require('multimodal-isochrones');

/* Generate a graph with two nodes connected by an edge on line1
 * that takes 5 minutes to cross
 */
const graph = isochrones()
  .addNode('node1')
  .addNode('node2')
  .addEdge({ from: 'node1', to: 'node2', line: 'line1', time: 5 });
```

You can chain any number of `addNode` and `addEdge`, in any order to build your graph, the only constraint is that when creating an edge both nodes must be already added.


## Query

In order to get a list of nodes you need a query object, that can be constructed calling

```js
const query = graph.from('node1');

const nodes = query.get();
```

`.get()` returns all the nodes that match the constraints defined by the query object. The result is an array of objects like

```js
{
  node: 'node2', // the target node
  paths: [ // a list of paths the go from a source node to the target
    {
      from: 'node1', // the source node
      lines: ['line1'], // the list of lines traversed
      time: 5, // total time from source to target
    }
  ],
}
```

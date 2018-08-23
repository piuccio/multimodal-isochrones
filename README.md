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
  

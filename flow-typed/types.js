interface GraphInterface {
  // Build the graph
  addNode(node: string): GraphInterface;
  addEdge(edge: Edge): GraphInterface;

  // Query
  from(node: string): QueryInterface;
}

interface QueryInterface {
  get(): Array<ReachableNode>
}

declare type Edge = {
  from: string,
  to: string,
  time: number,
  line: string,
}

declare type ReachableNode = {
  node: string,
  paths: Array<Path>,
}

declare type Path = {
  from: string,
  lines: Array<string>,
  time: number,
}

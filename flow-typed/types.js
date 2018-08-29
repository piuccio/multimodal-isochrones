interface GraphInterface {
  // Build the graph
  addNode(node: string): GraphInterface;
  addEdge(edge: Edge): GraphInterface;

  // Query
  from(node: string): QueryInterface;
  intersect(...queries: Array<QueryInterface>): GetterInterface;
}

interface QueryInterface {
  // Additional filtering
  maxTime(time: number): QueryInterface;
  maxLines(count: number): QueryInterface;

  // Getters
  get(): Array<ReachableNode>;
}

interface GetterInterface {
  get(): Array<ReachableNode>;
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

interface GraphInterface {
  // Build the graph
  addEdge(edge: Edge): GraphInterface;
  addConnection(node: string, line1: string, line2: string, time: number): GraphInterface;

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

declare type GraphOptions = {
  defaultConnectionTime?: number,
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

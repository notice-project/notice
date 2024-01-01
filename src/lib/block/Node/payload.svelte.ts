export type NodeType =
  | "BlockNode"
  | "HeadingNode"
  | "ListItemNode"
  | "RootNode";

type NodePayloadConstructor = {
  id: string;
  value: string;
  type: NodeType;
};

export interface NodePayload {
  id: string;
  type: NodeType;
  value: string;
  children: NodePayload[];
}

export abstract class NodePayloadClass {
  id: string;
  value: string;
  type: NodeType;
  children: NodePayloadClass[];

  constructor({ id, type, value }: NodePayloadConstructor) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.children = [];
  }

  appendChild(node: NodePayloadClass) {
    this.children.push(node);
  }

  abstract json(): NodePayload;
}

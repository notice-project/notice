import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

type HeadingNodeClassConstructor = {
  value: string;
  children: NodeClass[];
  rootChildId: string;
  root: NodeClass;
  level: number;
  parent?: NodeClass;
};

/* eslint-disable no-self-assign */
export class HeadingNodeClass extends NodeClass {
  level: number;

  constructor({
    value,
    children,
    rootChildId,
    root,
    level,
    parent,
  }: HeadingNodeClassConstructor) {
    super({ value, children, rootChildId, root, parent });
    this.level = level;
    this.registerAction("Enter", () => {
      this.parent.appendChild(
        new BlockNodeClass({
          value: "",
          children: [],
          rootChildId: this.rootChildId,
          root: this.root,
          parent: this.parent,
        }),
        this.index + 1,
      );
    });
  }

  notifyUpdate() {}

  appendChild(node: NodeClass, index: number): void {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

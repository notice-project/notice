import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class HeadingNodeClass extends NodeClass {
  level: number;

  constructor(
    value: string,
    children: NodeClass[],
    rootChildId: string,
    root: NodeClass,
    level: number,
    parent?: NodeClass,
  ) {
    super(value, children, rootChildId, root, parent);
    this.level = level;
    this.registerAction("Enter", () => {
      this.parent.appendChild(
        new BlockNodeClass("", [], rootChildId, root, this.parent),
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

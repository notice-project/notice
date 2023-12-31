import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  constructor(value: string, children: NodeClass[]) {
    super(value, children, "");
    this.registerAction("Enter", () => {
      this.appendChild(
        new BlockNodeClass("", [], "", this, this),
        this.children.length,
      );
    });
  }

  notifyUpdate() {
    // do nothing
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

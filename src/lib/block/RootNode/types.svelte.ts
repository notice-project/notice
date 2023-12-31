import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  constructor(value: string, children: NodeClass[], parent?: NodeClass) {
    super(value, children, parent);
    this.registerAction("Enter", () => {
      this.parent.appendChild(
        new BlockNodeClass("", [], this.parent),
        this.index + 1,
      );
    });
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

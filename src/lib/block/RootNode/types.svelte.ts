import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

type RootNodeClassConstructor = {
  value: string;
  children: NodeClass[];
};

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  constructor({ value, children }: RootNodeClassConstructor) {
    super({ value, children, rootChildId: "" });
    this.registerAction("Enter", () => {
      this.appendChild(
        new BlockNodeClass({
          value: "",
          children: [],
          rootChildId: "",
          root: this,
          parent: this,
        }),
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

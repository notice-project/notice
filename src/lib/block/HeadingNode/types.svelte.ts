import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class HeadingNodeClass extends NodeClass {
  level: number;

  constructor(
    value: string,
    children: NodeClass[],
    level: number,
    parent?: NodeClass,
  ) {
    super(value, children, parent);
    this.level = level;
    this.registerAction("Enter", () => {
      this.parent.appendChild(
        new BlockNodeClass("", [], this.parent),
        this.index + 1,
      );
    });
  }

  appendChild(node: NodeClass, index: number): void {
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

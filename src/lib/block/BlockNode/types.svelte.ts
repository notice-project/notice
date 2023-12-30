import { HeadingNodeClass } from "../HeadingNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class BlockNodeClass extends NodeClass {
  constructor(
    value: string,
    children: BlockNodeClass[],
    parent?: BlockNodeClass,
  ) {
    super(value, children, parent);
  }

  appendChild(value: string, index: number): void {
    this.children.splice(index, 0, new BlockNodeClass(value, [], this));
    this.children = this.children;
  }

  inputListener() {
    const match = this.value.match(/^#{1,3}\s/);
    if (match) {
      this.value = this.value.replace(/^#{1,3}\s/, "");
      this.transformType(
        new HeadingNodeClass(
          this.value,
          this.children,
          match[0].length,
          this.parent,
        ),
      );
    }
  }
}

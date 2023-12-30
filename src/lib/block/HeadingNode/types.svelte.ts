import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class HeadingNodeClass extends NodeClass {
  level: number;

  constructor(
    value: string,
    children: BlockNodeClass[],
    level: number,
    parent?: BlockNodeClass,
  ) {
    super(value, children, parent);
    this.level = level;
  }

  appendChild(value: string, index: number): void {
    this.children.splice(index, 0, new BlockNodeClass(value, [], this));
    this.children = this.children;
  }

  inputListener() {
    /* noop */
  }
}

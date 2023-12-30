import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

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

  createNode(
    value: string,
    children: NodeClass[],
    parent?: NodeClass,
  ): NodeClass {
    return new HeadingNodeClass(value, children, this.level, parent);
  }

  inputListener() {
    /* noop */
  }
}

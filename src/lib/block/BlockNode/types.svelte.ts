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

  createNode(
    value: string,
    children: NodeClass[],
    parent?: NodeClass,
  ): NodeClass {
    return new BlockNodeClass(value, children, parent);
  }

  keydownHandler(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter":
        this.parent.appendChild("", this.index + 1);
        break;
      case "Backspace":
        if (this.value === "" && this.index !== 0) {
          this.parent.removeChild(this.id);
        }
        break;
      case "ArrowUp":
        if (this.index > 0) {
          this.parent.children[this.index - 1]?.inputRef?.focus();
        }
        break;
      case "ArrowDown":
        if (this.index < this.parent.children.length - 1) {
          this.parent.children[this.index + 1]?.inputRef?.focus();
        }
        break;
    }
  }

  inputListener() {
    // const match = this.value.match(/^#{1,3}\s/);
    // if (match) {
    //   this.value = this.value.replace(/^#{1,3}\s/, "");
    //   this.transformType(
    //     new HeadingNodeClass(
    //       this.value,
    //       this.children,
    //       match[0].length,
    //       this.parent,
    //     ),
    //   );
    // }
  }
}

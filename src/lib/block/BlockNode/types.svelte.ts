/* eslint-disable no-self-assign */
export class BlockNodeClass {
  value = $state("");
  children = $state<BlockNodeClass[]>([]);
  inputRef = $state<HTMLInputElement | null>(null);
  parent = $state<BlockNodeClass>(this);
  index = $derived(this.getIndex());
  id = crypto.randomUUID();

  constructor(
    value: string,
    children: BlockNodeClass[],
    parent?: BlockNodeClass,
  ) {
    this.value = value;
    this.children = children;
    if (parent) {
      this.parent = parent;
    }
  }

  appendChild(value: string, index: number) {
    this.children.splice(index, 0, new BlockNodeClass(value, [], this));
    this.children = this.children;
    console.log(this.children);
  }

  removeChild(childId: string) {
    const index = this.children.findIndex((child) => child.id === childId);

    if (index !== -1) {
      this.children[Math.max(0, index - 1)]?.inputRef?.focus();
      this.children.splice(index, 1);
      this.children = this.children;
    }
  }

  // transformType(node: BlockNodeClass) {
  //   if (this.parent == null) {
  //     return;
  //   }
  //   this.parent?.children[this.index] = node;
  // }

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

  private getIndex() {
    if (this.parent == null) {
      return -1;
    }

    return this.parent.children.findIndex((child) => child.id === this.id);
  }
}

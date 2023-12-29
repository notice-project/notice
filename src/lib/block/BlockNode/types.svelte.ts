/* eslint-disable no-self-assign */
export class BlockNodeClass {
  value = $state("");
  children = $state<BlockNodeClass[]>([]);
  inputRef = $state<HTMLInputElement | null>(null);
  parent = $state<BlockNodeClass | null>(null);
  index = $derived(this.getIndex());
  id = crypto.randomUUID();

  constructor(
    value: string,
    children: BlockNodeClass[],
    parent: BlockNodeClass | null,
  ) {
    this.value = value;
    this.children = children;
    this.parent = parent;
  }

  appendChild(value: string) {
    this.children.push(new BlockNodeClass(value, [], this));
    this.children = this.children;
  }

  removeChild(childId: string) {
    const index = this.children.findIndex((child) => child.id === childId);

    if (index !== -1) {
      this.children[Math.max(0, index - 1)]?.inputRef?.focus();
      this.children.splice(index, 1);
      this.children = this.children;
    }
  }

  keydownHandler(e: KeyboardEvent) {
    if (this.parent == null) {
      return;
    }
    switch (e.key) {
      case "Enter":
        this.parent.appendChild("");
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

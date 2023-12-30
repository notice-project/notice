/* eslint-disable no-self-assign */
export abstract class NodeClass {
  value = $state("");
  children = $state<NodeClass[]>([]);
  inputRef = $state<HTMLInputElement | null>(null);
  parent = $state<NodeClass>(this);
  index = $derived(this.getIndex());
  id = crypto.randomUUID();

  constructor(value: string, children: NodeClass[], parent?: NodeClass) {
    this.value = value;
    this.children = children;
    if (parent) {
      this.parent = parent;
    }
  }

  abstract inputListener(): void;
  abstract appendChild(value: string, index: number): void;

  removeChild(childId: string) {
    const index = this.children.findIndex((child) => child.id === childId);

    if (index !== -1) {
      this.children[Math.max(0, index - 1)]?.inputRef?.focus();
      this.children.splice(index, 1);
      this.children = this.children;
    }
  }

  focusAt(cursorPos: number) {
    const pos = Math.min(cursorPos, this.value.length);
    this.inputRef?.focus();
    this.inputRef?.setSelectionRange(pos, pos);
  }

  transformType(node: NodeClass) {
    this.parent.children[this.index] = node;
  }

  keydownHandler(e: KeyboardEvent) {
    const cursorPos = this.inputRef?.selectionStart ?? 0;

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
        e.preventDefault();
        if (this.index > 0) {
          this.parent.children[this.index - 1]?.focusAt(cursorPos);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (this.index < this.parent.children.length - 1) {
          this.parent.children[this.index + 1]?.focusAt(cursorPos);
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

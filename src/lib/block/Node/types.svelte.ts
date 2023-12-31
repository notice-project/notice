/* eslint-disable no-self-assign */

type KeyAction = Record<string, (e: KeyboardEvent) => void>;

export abstract class NodeClass {
  value = $state("");
  children = $state<NodeClass[]>([]);
  inputRef = $state<HTMLInputElement | null>(null);
  parent = $state<NodeClass>(this);
  index = $derived(this.getIndex());
  focusOnMount = $state(true);

  id = crypto.randomUUID();
  keyActions: KeyAction = {
    Backspace: () => {
      if (this.value === "" && this.index !== 0) {
        this.parent.removeChild(this.id);
      }
    },
    ArrowUp: (e) => {
      e.preventDefault();

      const cursorPos = this.inputRef?.selectionStart ?? 0;

      const node = this.prevNode();
      node?.focusAt(cursorPos);
    },
    ArrowDown: (e) => {
      e.preventDefault();

      const cursorPos = this.inputRef?.selectionStart ?? 0;

      const nextNode = this.nextNode(true);
      nextNode?.focusAt(cursorPos);
    },
  };

  constructor(value: string, children: NodeClass[], parent?: NodeClass) {
    this.value = value;
    this.children = children;
    if (parent) {
      this.parent = parent;
    }
  }

  abstract appendChild(node: NodeClass, index: number): void;

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
    for (const child of this.children) {
      child.parent = node;
    }

    this.parent.children[this.index] = node;
  }

  keydownHandler(e: KeyboardEvent) {
    const action = this.keyActions[e.key];

    if (action) {
      action(e);
    }
  }

  registerAction(key: string, action: (e: KeyboardEvent) => void) {
    this.keyActions[key] = action;
  }

  isRoot() {
    return this.parent === this;
  }

  prevNode(): NodeClass | null {
    if (this.index > 0) {
      return this.parent.children[this.index - 1]!.deepestChild();
    }

    if (this.parent.isRoot()) {
      return null;
    }

    return this.parent;
  }

  nextNode(containChild: boolean): NodeClass | null {
    if (this.children.length > 0 && containChild) {
      return this.children[0]!;
    }

    if (this.index < this.parent.children.length - 1) {
      return this.parent.children[this.index + 1]!;
    }

    if (this.parent.isRoot()) {
      return null;
    }

    return this.parent.nextNode(false);
  }

  private getIndex() {
    return this.parent.children.findIndex((child) => child.id === this.id);
  }

  private deepestChild(): NodeClass {
    if (this.children.length === 0) {
      return this;
    }

    return this.children[this.children.length - 1]!.deepestChild();
  }
}

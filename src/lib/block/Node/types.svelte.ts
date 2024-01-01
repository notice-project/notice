/* eslint-disable no-self-assign */

import type { NodePayloadClass } from "./payload.svelte";

type KeyAction = Record<string, (e: KeyboardEvent) => void>;

type NodeClassConstructor = {
  value: string;
  children: NodeClass[];
  rootChildId: string;
  root?: NodeClass;
  parent?: NodeClass;
};

export abstract class NodeClass {
  id = crypto.randomUUID();
  _value = $state("");
  children = $state<NodeClass[]>([]);
  inputRef = $state<HTMLInputElement | null>(null);
  focusOnMount = $state(true);

  parent = $state<NodeClass>(this);
  root = $state<NodeClass>(this);

  index = $derived(this.getIndex());
  rootChildId = $state("");

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

  constructor({
    value,
    children,
    rootChildId,
    root,
    parent,
  }: NodeClassConstructor) {
    this._value = value;
    this.children = children;
    if (this.parent.isRoot()) {
      this.rootChildId = this.id;
    } else {
      this.rootChildId = rootChildId;
    }

    if (root) {
      this.root = root;
    }

    if (parent) {
      this.parent = parent;
    }
  }

  abstract appendChild(node: NodeClass, index: number): void;
  abstract notifyUpdate(): void;
  abstract dump(): NodePayloadClass;

  set value(value: string) {
    this._value = value;
    this.notifyUpdate();
  }

  get value() {
    return this._value;
  }

  removeChild(childId: string) {
    this.notifyUpdate();
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
    node.notifyUpdate();
  }

  keydownHandler(e: KeyboardEvent) {
    // this.notifyUpdate();
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
    if (this.isRoot()) {
      return null;
    }

    if (this.index > 0) {
      return this.parent.children[this.index - 1]!.deepestChild();
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

  updateRootChildId(id: string) {
    this.rootChildId = id;
    for (const child of this.children) {
      child.updateRootChildId(id);
    }

    this.notifyUpdate();
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

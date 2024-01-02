/* eslint-disable no-self-assign */

import type { RootNodeClass } from "../RootNode/types.svelte";
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
  id: string = crypto.randomUUID();
  _value = $state("");
  children = $state<NodeClass[]>([]);
  inputRef = $state<HTMLDivElement | null>(null);
  focusOnMount = $state(true);

  parent = $state<NodeClass>(this);
  root = $state<NodeClass>(this);

  index = $derived(this.getIndex());
  rootChildId = $state("");

  keyActions: KeyAction = {
    Backspace: () => {
      if (this.value === "" && !this.isRoot()) {
        const node = this.prevNode();
        console.log(node?.value);
        node?.focusAt(node.value.length);

        this.parent.removeChild(this.id);
      }
    },
    ArrowUp: (e) => {
      if (!this.shouldJumpToPrev()) {
        return;
      }

      e.preventDefault();

      const cursorPos = this.getCaretPosition();

      const node = this.prevNode();
      node?.focusAt(cursorPos);
    },
    ArrowDown: (e) => {
      if (!this.shouldJumpToNext()) {
        return;
      }

      e.preventDefault();

      const cursorPos = this.getCaretPosition();

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
  abstract serverAppendChild(node: NodeClass, index: number): void;
  abstract shouldJumpToPrev(): boolean;
  abstract shouldJumpToNext(): boolean;

  abstract notifyUpdate(): void;
  abstract dump(): NodePayloadClass;

  set value(value: string) {
    this._value = value;
    if (this.isRoot()) {
      this.updateTitle = true;
      return;
    }

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
    if (this.inputRef == null) {
      return;
    }

    if (this.inputRef.firstChild == null || this.inputRef.textContent == null) {
      this.inputRef.focus();
      return;
    }

    const selection = window.getSelection();

    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.setStart(
      this.inputRef.firstChild!,
      Math.min(cursorPos, this.inputRef.textContent!.length),
    );
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
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

  isRoot(): this is RootNodeClass {
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

  private getCaretPosition() {
    const selection = window.getSelection();

    if (!selection || this.inputRef == null) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(this.inputRef);
    clonedRange.setEnd(range.endContainer, range.endOffset);

    return clonedRange.toString().length;
  }
}

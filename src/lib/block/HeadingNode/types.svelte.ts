import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";
import { HeadingNodePayloadClass } from "./payload.svelte";

type HeadingNodeClassConstructor = {
  value: string;
  children: NodeClass[];
  rootChildId: string;
  root: NodeClass;
  level: number;
  parent?: NodeClass;
};

/* eslint-disable no-self-assign */
export class HeadingNodeClass extends NodeClass {
  level: number;

  constructor({
    value,
    children,
    rootChildId,
    root,
    level,
    parent,
  }: HeadingNodeClassConstructor) {
    super({ value, children, rootChildId, root, parent });
    this.level = level;
    this.registerAction("Enter", (e) => {
      e.preventDefault();

      this.parent.appendChild(
        new BlockNodeClass({
          value: "",
          children: [],
          rootChildId: this.rootChildId,
          root: this.root,
          parent: this.parent,
        }),
        this.index + 1,
      );
    });
  }

  notifyUpdate() {
    if (!this.root.isRoot()) {
      return;
    }

    this.root.appendNeedUpdateId(this.rootChildId);
  }

  shouldJumpToPrev() {
    if (this.inputRef == null) {
      return false;
    }

    const selection = window.getSelection();
    if (!selection) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const cursorRect = range.getBoundingClientRect();
    const inputRect = this.inputRef.getBoundingClientRect();

    switch (this.level) {
      case 1:
        if (cursorRect.bottom - inputRect.top <= 46) {
          return true;
        }
        return false;
      case 2:
        if (cursorRect.bottom - inputRect.top <= 40) {
          return true;
        }
        return false;
      case 3:
        if (cursorRect.bottom - inputRect.top <= 35) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  shouldJumpToNext() {
    if (this.inputRef == null) {
      return false;
    }

    if (this.value == "") {
      return true;
    }

    const selection = window.getSelection();
    if (!selection) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const cursorRect = range.getBoundingClientRect();
    const inputRect = this.inputRef.getBoundingClientRect();

    switch (this.level) {
      case 1:
        if (inputRect.bottom - cursorRect.top <= 47) {
          return true;
        }
        return false;
      case 2:
        if (inputRect.bottom - cursorRect.top <= 41) {
          return true;
        }
        return false;
      case 3:
        if (inputRect.bottom - cursorRect.top <= 35) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  dump(): HeadingNodePayloadClass {
    const payload = new HeadingNodePayloadClass({
      id: this.id,
      value: this.value,
      level: this.level,
    });

    for (const child of this.children) {
      payload.appendChild(child.dump());
    }

    return payload;
  }

  appendChild(node: NodeClass, index: number): void {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;

    node.updateRootChildId(this.rootChildId);
    this.notifyUpdate();
  }
}

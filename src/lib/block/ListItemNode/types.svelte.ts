import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";
import { ListItemNodePayloadClass } from "./payload.svelte";

type ListItemNodeClassConstructor = {
  value: string;
  children: NodeClass[];
  rootChildId: string;
  root: NodeClass;
  parent: NodeClass;
};

/* eslint-disable no-self-assign */
export class ListItemNodeClass extends NodeClass {
  constructor({
    value,
    children,
    rootChildId,
    root,
    parent,
  }: ListItemNodeClassConstructor) {
    super({ value, children, rootChildId, root, parent });
    this.registerAction("Backspace", () => {
      if (this.value === "") {
        this.transformType(
          new BlockNodeClass({
            value: "",
            children: this.children,
            rootChildId: this.rootChildId,
            root: this.root,
            parent: this.parent,
          }),
        );
      }
    });
    this.registerAction("Enter", (e) => {
      e.preventDefault();

      if (this.children.length === 0) {
        this.parent.appendChild(
          new ListItemNodeClass({
            value: "",
            children: [],
            rootChildId: this.rootChildId,
            root: this.root,
            parent: this.parent,
          }),
          this.index + 1,
        );
        return;
      }

      const nextNode = new ListItemNodeClass({
        value: "",
        children: [],
        rootChildId: this.rootChildId,
        root: this.root,
        parent: this.parent,
      });
      this.parent.appendChild(nextNode, this.index + 1);

      for (const child of this.children) {
        nextNode.appendChild(child, nextNode.children.length);
      }

      this.children = [];
    });
    this.registerAction("Tab", (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        if (this.parent.isRoot()) {
          return;
        }

        const parentChildrenLen = this.parent.children.length;
        for (let i = this.index + 1; i < parentChildrenLen; i++) {
          const child = this.parent.children[i];
          if (child === undefined) {
            return;
          }

          this.appendChild(child, this.children.length);
        }

        for (let i = parentChildrenLen - 1; i > this.index; i--) {
          const child = this.parent.children[i];
          if (child === undefined) {
            return;
          }

          this.parent.removeChild(child.id);
        }

        this.focusOnMount = true;
        this.parent.removeChild(this.id);
        this.parent.parent.appendChild(this, this.parent.index + 1);
        return;
      }

      const prevNode = this.parent.children[this.index - 1];
      if (!(prevNode instanceof ListItemNodeClass)) {
        return;
      }

      this.parent.removeChild(this.id);
      this.parent = prevNode;
      this.focusOnMount = true;
      prevNode.appendChild(this, prevNode.children.length);

      for (const child of this.children) {
        prevNode.appendChild(child, prevNode.children.length);
      }

      this.children = [];
    });
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

    if (cursorRect.bottom - inputRect.top <= 26) {
      return true;
    }

    return false;
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

    if (inputRect.bottom - cursorRect.top <= 26) {
      return true;
    }

    return false;
  }

  notifyUpdate() {
    if (!this.root.isRoot()) {
      return;
    }

    this.root.appendNeedUpdateId(this.rootChildId);
  }

  dump(): ListItemNodePayloadClass {
    const payload = new ListItemNodePayloadClass({
      id: this.id,
      value: this.value,
    });

    for (const child of this.children) {
      payload.appendChild(child.dump());
    }

    return payload;
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;

    node.updateRootChildId(this.rootChildId);
    this.notifyUpdate();
  }
}

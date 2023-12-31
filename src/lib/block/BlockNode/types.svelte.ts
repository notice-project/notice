import { HeadingNodeClass } from "../HeadingNode/types.svelte";
import { ListItemNodeClass } from "../ListItemNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";
import { BlockNodePayloadClass } from "./payload.svelte";

type BlockNodeClassConstructor = {
  value: string;
  children: NodeClass[];
  rootChildId: string;
  root: NodeClass;
  parent: NodeClass;
};

/* eslint-disable no-self-assign */
export class BlockNodeClass extends NodeClass {
  constructor({
    value,
    children,
    rootChildId,
    root,
    parent,
  }: BlockNodeClassConstructor) {
    super({ value, children, rootChildId, root, parent });
    this.registerAction("Enter", (e) => {
      e.preventDefault();
      this.parent.appendChild(
        new BlockNodeClass({
          value: "",
          children: [],
          rootChildId,
          root: this.root,
          parent: this.parent,
        }),
        this.index + 1,
      );
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

  dump(): BlockNodePayloadClass {
    const payload = new BlockNodePayloadClass({
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

  inputListener() {
    const headingMatch = this.value.match(/^#{1,3}\s/);

    if (headingMatch) {
      this.value = this.value.replace(/^#{1,3}\s/, "");
      this.transformType(
        new HeadingNodeClass({
          value: this.value,
          children: this.children,
          rootChildId: this.rootChildId,
          root: this.root,
          level: headingMatch[0].length - 1,
          parent: this.parent,
        }),
      );
    }

    if (this.value.startsWith("- ")) {
      this.value = this.value.replace("- ", "");
      this.transformType(
        new ListItemNodeClass({
          value: this.value,
          children: this.children,
          rootChildId: this.rootChildId,
          root: this.root,
          parent: this.parent,
        }),
      );
    }
  }
}

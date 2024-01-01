import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";
import { RootNodePayloadClass } from "./payload.svelte";

type RootNodeClassConstructor = {
  value: string;
  children: NodeClass[];
};

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  needUpdateIds = $state<Set<string>>(new Set());
  updateTitle = $state(false);

  constructor({ value, children }: RootNodeClassConstructor) {
    super({ value, children, rootChildId: "" });
    this.registerAction("Enter", (e) => {
      e.preventDefault();
      this.appendChild(
        new BlockNodeClass({
          value: "",
          children: [],
          rootChildId: "",
          root: this,
          parent: this,
        }),
        this.children.length,
      );
    });

    $effect(() => {
      const intervalId = setInterval(() => {
        this.upload();
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    });
  }

  notifyUpdate() {
    this.updateTitle = true;
  }

  shouldJumpToPrev() {
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

    if (inputRect.bottom - cursorRect.top <= 57) {
      return true;
    }

    return false;
  }

  dump() {
    const payload = new RootNodePayloadClass();

    for (const childId of this.needUpdateIds) {
      const node = this.children.find((child) => child.id === childId);
      if (!node) {
        continue;
      }

      payload.appendChild(node.dump());
    }

    return payload;
  }

  upload() {
    if (this.updateTitle) {
      console.log(this.value);
      this.updateTitle = false;
    }

    const payload = this.dump();
    console.log(payload.json());

    this.needUpdateIds.clear();
  }

  appendNeedUpdateId(id: string) {
    this.needUpdateIds.add(id);
    this.needUpdateIds = this.needUpdateIds;
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;

    node.updateRootChildId(node.id);
  }
}

import type { BlockNodePayload } from "../BlockNode/payload.svelte";
import { BlockNodeClass } from "../BlockNode/types.svelte";
import type { HeadingNodePayload } from "../HeadingNode/payload.svelte";
import { HeadingNodeClass } from "../HeadingNode/types.svelte";
import type { ListItemNodePayload } from "../ListItemNode/payload.svelte";
import { ListItemNodeClass } from "../ListItemNode/types.svelte";
import type { NodePayload } from "../Node/payload.svelte";
import { NodeClass } from "../Node/types.svelte";
import { RootNodePayloadClass, type RootNodePayload } from "./payload.svelte";

type RootNodeClassConstructor = {
  value: string;
  children: NodeClass[];
};

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  needUpdateIds = $state<Set<string>>(new Set());
  updateTitle = $state(false);
  updateAll = $state(false);

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
  }

  notifyUpdate() {
    this.updateAll = true;
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

    if (inputRect.bottom - cursorRect.top <= 84) {
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

  dumpAll() {
    const payload = new RootNodePayloadClass();

    for (const child of this.children) {
      payload.appendChild(child.dump());
    }

    return payload;
  }

  upload() {
    if (this.updateTitle) {
      this.updateTitle = false;
    }

    const payload = this.dump();
    console.log(payload.json());

    this.needUpdateIds.clear();
  }

  static load(payload: RootNodePayload): RootNodeClass {
    const rootNode = new RootNodeClass({ value: payload.value, children: [] });
    rootNode.id = payload.id;

    const loadChildren = (currentNode: NodeClass, payload: NodePayload) => {
      payload.children.forEach((child, idx) => {
        switch (child.type) {
          case "BlockNode":
            currentNode.appendChild(
              rootNode.loadBlockNode(currentNode, child),
              idx,
            );
            break;
          case "HeadingNode":
            currentNode.appendChild(
              rootNode.loadHeadingNode(
                currentNode,
                child as HeadingNodePayload,
              ),
              idx,
            );
            break;
          case "ListItemNode":
            currentNode.appendChild(
              rootNode.loadListItemNode(currentNode, child),
              idx,
            );
            break;
          default:
            throw new Error("Invalid node type");
        }

        loadChildren(currentNode.children[idx]!, child);
      });

      return currentNode;
    };

    return loadChildren(rootNode, payload) as RootNodeClass;
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

  serverAppendChild(node: NodeClass, index: number) {
    node.parent = this;

    this.children.splice(index, 0, node);
    this.children = this.children;

    node.updateRootChildId(node.id);
  }

  private loadBlockNode(parent: NodeClass, payload: BlockNodePayload) {
    const node = new BlockNodeClass({
      value: payload.value,
      children: [],
      rootChildId: parent.parent.isRoot() ? parent.id : parent.rootChildId,
      root: this,
      parent: parent,
    });
    node.id = payload.id;

    return node;
  }

  private loadHeadingNode(parent: NodeClass, payload: HeadingNodePayload) {
    const node = new HeadingNodeClass({
      value: payload.value,
      children: [],
      rootChildId: parent.parent.isRoot() ? parent.id : parent.rootChildId,
      root: this,
      parent: parent,
      level: payload.level,
    });
    node.id = payload.id;

    return node;
  }

  private loadListItemNode(parent: NodeClass, payload: ListItemNodePayload) {
    const node = new ListItemNodeClass({
      value: payload.value,
      children: [],
      rootChildId: parent.parent.isRoot() ? parent.id : parent.rootChildId,
      root: this,
      parent: parent,
    });
    node.id = payload.id;

    return node;
  }
}

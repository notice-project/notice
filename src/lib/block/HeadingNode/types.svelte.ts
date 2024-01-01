import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";
import { RootNodeClass } from "../RootNode/types.svelte";
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
    this.registerAction("Enter", () => {
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
    if (!(this.root instanceof RootNodeClass)) {
      return;
    }

    this.root.appendNeedUpdateId(this.rootChildId);
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

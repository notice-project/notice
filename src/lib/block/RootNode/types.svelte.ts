import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

type RootNodeClassConstructor = {
  value: string;
  children: NodeClass[];
};

/* eslint-disable no-self-assign */
export class RootNodeClass extends NodeClass {
  needUpdateIds = $state<Set<string>>(new Set());

  constructor({ value, children }: RootNodeClassConstructor) {
    super({ value, children, rootChildId: "" });
    this.registerAction("Enter", () => {
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
        console.log("children: ", this.children);
        console.log("needToUpdate: ", this.needUpdateIds);
        this.needUpdateIds.clear();
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    });
  }

  notifyUpdate() {
    // do nothing
  }

  appendNeedUpdateId(id: string) {
    this.needUpdateIds.add(id);
    this.needUpdateIds = this.needUpdateIds;
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

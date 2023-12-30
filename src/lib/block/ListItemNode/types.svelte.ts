import { BlockNodeClass } from "../BlockNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class ListItemNodeClass extends NodeClass {
  constructor(value: string, children: NodeClass[], parent: NodeClass) {
    super(value, children, parent);
    this.registerAction("Backspace", () => {
      if (this.value === "") {
        this.transformType(new BlockNodeClass("", this.children, this.parent));
      }
    });
    this.registerAction("Enter", () => {
      if (this.children.length === 0) {
        this.parent.appendChild(
          new ListItemNodeClass("", [], this.parent),
          this.index + 1,
        );
        return;
      }

      const nextNode = new ListItemNodeClass("", [], this.parent);
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

        for (let i = this.index + 1; i < this.parent.children.length; i++) {
          const child = this.parent.children[i];
          if (child === undefined) {
            return;
          }

          this.appendChild(child, this.children.length);
          this.parent.removeChild(child.id);
        }

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

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }
}

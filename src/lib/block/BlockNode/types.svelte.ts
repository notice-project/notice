import { HeadingNodeClass } from "../HeadingNode/types.svelte";
import { ListItemNodeClass } from "../ListItemNode/types.svelte";
import { NodeClass } from "../Node/types.svelte";

/* eslint-disable no-self-assign */
export class BlockNodeClass extends NodeClass {
  constructor(value: string, children: NodeClass[], parent?: NodeClass) {
    super(value, children, parent);
    this.registerAction("Enter", () => {
      this.parent.appendChild(
        new BlockNodeClass("", [], this.parent),
        this.index + 1,
      );
    });
  }

  appendChild(node: NodeClass, index: number) {
    node.parent = this;
    this.children.splice(index, 0, node);
    this.children = this.children;
  }

  inputListener() {
    const headingMatch = this.value.match(/^#{1,3}\s/);

    if (headingMatch) {
      this.value = this.value.replace(/^#{1,3}\s/, "");
      this.transformType(
        new HeadingNodeClass(
          this.value,
          this.children,
          headingMatch[0].length - 1,
          this.parent,
        ),
      );
    }

    if (this.value.startsWith("- ")) {
      this.value = this.value.replace("- ", "");
      this.transformType(
        new ListItemNodeClass(this.value, this.children, this.parent),
      );
    }
  }
}

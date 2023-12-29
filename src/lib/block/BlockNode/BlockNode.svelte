<script context="module" lang="ts">
  type AppendSibling = (value: string) => void;

  export class BlockNodeClass {
    constructor(
      value: string,
      children: BlockNodeClass[],
      parent: BlockNodeClass | null,
    ) {
      this.value = value;
      this.children = children;
      this.parent = parent;
      this.id = crypto.randomUUID();
    }

    appendChild(value: string) {
      this.children.push(new BlockNodeClass(value, [], this));
      this.children = this.children;
    }

    keydownHandler(e: KeyboardEvent) {
      if (e.key === "Enter") {
        this.parent?.appendChild("");
      }

      if (e.key === "Backspace" && this.value === "") {
        this.children.pop();
        this.children = this.children;
      }
    }

    id: string;
    value = $state("");
    children = $state<BlockNodeClass[]>([]);
    inputRef = $state<HTMLInputElement | null>(null);
    parent = $state<BlockNodeClass | null>(null);
  }
</script>

<script lang="ts">
  type BlockNodeProps = {
    node: BlockNodeClass;
  };

  let { node } = $props<BlockNodeProps>();

  $effect(() => {
    if (node.inputRef) {
      node.inputRef.focus();
    }
  });
</script>

<input
  type="text"
  class="border"
  bind:this={node.inputRef}
  bind:value={node.value}
  onkeydown={(e) => node.keydownHandler(e)}
/>

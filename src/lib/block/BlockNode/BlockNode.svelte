<script lang="ts">
  import Node from "../Node/Node.svelte";
  import type { BlockNodeClass } from "./types.svelte";

  type BlockNodeProps = {
    node: BlockNodeClass;
  };

  let { node } = $props<BlockNodeProps>();

  $effect(() => {
    if (node.inputRef && node.focusOnMount) {
      node.inputRef.focus();
      node.focusOnMount = false;
    }
  });

  $effect(() => {
    node.inputListener();
  });
</script>

<input
  type="text"
  class="border"
  bind:this={node.inputRef}
  bind:value={node.value}
  onkeydown={(e) => node.keydownHandler(e)}
/>
<div class="ml-4">
  {#each node.children as childNode (childNode.id)}
    <Node node={childNode} />
  {/each}
</div>

<script lang="ts">
  import type { BlockNodeClass } from "./types.svelte";

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

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

<div
  class="w-full flex-shrink-0 flex-grow whitespace-pre-wrap break-words p-1 outline-none"
  role="textbox"
  tabindex="0"
  contenteditable="true"
  bind:textContent={node.value}
  bind:this={node.inputRef}
  onkeydown={(e) => node.keydownHandler(e)}
/>
<div class="ml-4">
  {#each node.children as childNode (childNode.id)}
    <Node node={childNode} />
  {/each}
</div>

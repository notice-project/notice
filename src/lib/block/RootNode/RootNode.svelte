<script lang="ts">
  import Node from "../Node/Node.svelte";
  import type { RootNodeClass } from "./types.svelte";

  type RootNodeProps = {
    node: RootNodeClass;
  };

  let { node } = $props<RootNodeProps>();
</script>

<input
  type="text"
  class="border text-6xl"
  bind:this={node.inputRef}
  bind:value={node.value}
  onkeydown={(e) => node.keydownHandler(e)}
/>
{#each node.children as childNode (childNode.id)}
  <Node node={childNode} />
{/each}

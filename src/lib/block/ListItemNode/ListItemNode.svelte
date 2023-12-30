<script lang="ts">
  import Node from "../Node/Node.svelte";
  import type { ListItemNodeClass } from "./types.svelte";

  type ListItemNodeProps = {
    node: ListItemNodeClass;
  };

  let { node } = $props<ListItemNodeProps>();

  $effect(() => {
    if (node.inputRef && node.focusOnMount) {
      node.inputRef.focus();
      node.focusOnMount = false;
    }
  });
</script>

<ul class="ml-6 list-disc">
  <li>
    <input
      type="text"
      class="border"
      bind:value={node.value}
      bind:this={node.inputRef}
      onkeydown={(e) => node.keydownHandler(e)}
    />
    {#each node.children as childNode (childNode.id)}
      <Node node={childNode} />
    {/each}
  </li>
</ul>

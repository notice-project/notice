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
  <li class="w-full">
    <div
      class="w-full flex-shrink-0 flex-grow whitespace-pre-wrap break-words p-1 outline-none"
      role="textbox"
      tabindex="0"
      contenteditable="true"
      bind:this={node.inputRef}
      bind:textContent={node.value}
      onkeydown={(e) => node.keydownHandler(e)}
    />
    {#each node.children as childNode (childNode.id)}
      <Node node={childNode} />
    {/each}
  </li>
</ul>

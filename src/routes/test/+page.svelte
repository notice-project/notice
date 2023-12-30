<script lang="ts">
  import { BlockNodeClass } from "$lib/block/BlockNode/types.svelte";
  import Node from "$lib/block/Node/Node.svelte";
  import { onMount } from "svelte";

  let rootNode = new BlockNodeClass("root", []);

  onMount(() => {
    rootNode.appendChild(new BlockNodeClass("", [], rootNode), 0);
    rootNode = rootNode;
  });
</script>

<h1>This is test page</h1>

<div class="flex flex-col pl-4">
  {#each rootNode.children as childNode (childNode.id)}
    <Node node={childNode} />
  {/each}
</div>

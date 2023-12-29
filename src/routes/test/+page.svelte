<script lang="ts">
  import BlockNode, {
    BlockNodeClass,
  } from "$lib/block/BlockNode/BlockNode.svelte";
  import { onMount } from "svelte";

  let rootNode = new BlockNodeClass("root", [], null);

  onMount(() => {
    rootNode.appendChild("");
    rootNode = rootNode;

    console.log(rootNode);
  });

  $: console.log("rootNode: ", rootNode.children);
</script>

<h1>This is test page</h1>

<div class="flex flex-col pl-4">
  {#each rootNode.children as childNode}
    <BlockNode node={childNode} />
  {/each}
</div>

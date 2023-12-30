<script lang="ts">
  import BlockNode from "$lib/block/BlockNode/BlockNode.svelte";
  import { BlockNodeClass } from "$lib/block/BlockNode/types.svelte";
  import { onMount } from "svelte";

  let rootNode = new BlockNodeClass("root", []);

  onMount(() => {
    rootNode.appendChild("", 0);
    rootNode = rootNode;
  });

  $: console.log("rootNode: ", rootNode.children);
</script>

<h1>This is test page</h1>

<div class="flex flex-col pl-4">
  {#each rootNode.children as childNode (childNode.id)}
    <BlockNode node={childNode} />
  {/each}
</div>

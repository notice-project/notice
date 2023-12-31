<script lang="ts">
  import RootNode from "$lib/block/RootNode/RootNode.svelte";
  import { RootNodeClass } from "$lib/block/RootNode/types.svelte";

  let rootNode = new RootNodeClass({ value: "", children: [] });
</script>

<h1>This is test page</h1>

<div class="flex flex-col pl-4">
  <RootNode node={rootNode} />
</div>

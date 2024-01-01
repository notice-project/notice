<script lang="ts">
  import RootNode from "$lib/block/RootNode/RootNode.svelte";
  import { RootNodeClass } from "$lib/block/RootNode/types.svelte";

  let rootNode = new RootNodeClass({ value: "", children: [] });
</script>

<RootNode node={rootNode} />

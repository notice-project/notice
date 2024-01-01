<script lang="ts">
  import RootNode from "$lib/block/RootNode/RootNode.svelte";
  import { RootNodeClass } from "$lib/block/RootNode/types.svelte";
  import * as Button from "$lib/components/ui/button";
  import Mic from "$lib/icons/Mic.svelte";
  import Micoff from "$lib/icons/Micoff.svelte";

  let rootNode = new RootNodeClass({ value: "", children: [] });
  let isMicOn = $state(false);
</script>

<RootNode node={rootNode} />
<Button.Root
  variant="outline"
  size="icon"
  class="absolute bottom-8 right-8 rounded-full"
  onclick={() => {
    isMicOn = !isMicOn;
  }}
>
  {#if isMicOn}
    <Mic />
  {:else}
    <Micoff />
  {/if}
</Button.Root>

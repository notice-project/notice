<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HeadingNodeClass } from "./types.svelte";

  type HeadingNodeProps = {
    node: HeadingNodeClass;
  };

  let { node } = $props<HeadingNodeProps>();

  $effect(() => {
    if (node.inputRef) {
      node.inputRef.focus();
    }
  });

  let textSizeStyle = $derived(
    (() => {
      switch (node.level) {
        case 1:
          return "text-4xl";
        case 2:
          return "text-3xl";
        case 3:
          return "text-2xl";
        default:
          return "";
      }
    })(),
  );
</script>

<input
  type="text"
  class={cn("border", textSizeStyle)}
  bind:value={node.value}
  bind:this={node.inputRef}
  onkeydown={(e) => node.keydownHandler(e)}
/>

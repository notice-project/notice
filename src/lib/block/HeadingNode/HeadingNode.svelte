<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HeadingNodeClass } from "./types.svelte";

  type HeadingNodeProps = {
    node: HeadingNodeClass;
  };

  let { node } = $props<HeadingNodeProps>();

  $effect(() => {
    if (node.inputRef && node.focusOnMount) {
      node.inputRef.focus();
      node.focusOnMount = false;
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

<div
  class={cn(
    "w-full flex-shrink-0 flex-grow whitespace-pre-wrap break-words p-1",
    textSizeStyle,
  )}
  role="textbox"
  tabindex="0"
  contenteditable="true"
  bind:this={node.inputRef}
  bind:textContent={node.value}
  onkeydown={(e) => node.keydownHandler(e)}
/>

<script lang="ts">
  import Node from "../Node/Node.svelte";
  import type { RootNodeClass } from "./types.svelte";

  type RootNodeProps = {
    node: RootNodeClass;
  };

  let { node } = $props<RootNodeProps>();
</script>

<div
  class="w-full flex-shrink-0 flex-grow whitespace-pre-wrap break-words p-1 py-8 text-5xl outline-none"
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

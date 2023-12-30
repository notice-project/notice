<script lang="ts">
  import BlockNode from "../BlockNode/BlockNode.svelte";
  import { BlockNodeClass } from "../BlockNode/types.svelte";
  import HeadingNode from "../HeadingNode/HeadingNode.svelte";
  import { HeadingNodeClass } from "../HeadingNode/types.svelte";
  import ListItemNode from "../ListItemNode/ListItemNode.svelte";
  import { ListItemNodeClass } from "../ListItemNode/types.svelte";
  import type { NodeClass } from "./types.svelte";

  type NodeProps = {
    node: NodeClass;
  };
  let { node } = $props<NodeProps>();
</script>

{#if node instanceof BlockNodeClass}
  <BlockNode {node} />
{:else if node instanceof HeadingNodeClass}
  <HeadingNode {node} />
{:else if node instanceof ListItemNodeClass}
  <ListItemNode {node} />
{/if}

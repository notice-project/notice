import { BlockNodeClass } from "$lib/block/BlockNode/types.svelte";
import type { HeadingNodePayload } from "$lib/block/HeadingNode/payload.svelte";
import { HeadingNodeClass } from "$lib/block/HeadingNode/types.svelte";
import { ListItemNodeClass } from "$lib/block/ListItemNode/types.svelte";
import type { NodePayload } from "$lib/block/Node/payload.svelte";
import type { NodeClass } from "$lib/block/Node/types.svelte";
import type { RootNodeClass } from "$lib/block/RootNode/types.svelte";

export type InsertMessage = {
  index: number;
  path: string[];
  item: NodePayload;
};

export const insertMessageHandler = async (
  message: InsertMessage,
  rootNode: RootNodeClass,
) => {
  const { index, path, item } = message;
  let currentNode: NodeClass = rootNode;

  for (const id of path) {
    const child = currentNode.children.find((child) => child.id === id);
    if (!child) {
      return;
    }

    currentNode = child;
  }

  switch (item.type) {
    case "BlockNode": {
      const blockNode = new BlockNodeClass({
        root: rootNode,
        parent: currentNode,
        value: item.value,
        children: [],
        rootChildId: currentNode.isRoot() ? item.id : currentNode.rootChildId,
      });
      blockNode.id = item.id;
      blockNode.focusOnMount = false;

      currentNode.serverAppendChild(blockNode, index);
      break;
    }
    case "HeadingNode": {
      const headingNode = new HeadingNodeClass({
        root: rootNode,
        parent: currentNode,
        value: item.value,
        children: [],
        rootChildId: currentNode.isRoot() ? item.id : currentNode.rootChildId,
        level: (item as HeadingNodePayload).level,
      });
      headingNode.id = item.id;
      headingNode.focusOnMount = false;

      currentNode.serverAppendChild(headingNode, index);
      break;
    }
    case "ListItemNode": {
      const itemNode = new ListItemNodeClass({
        root: rootNode,
        parent: currentNode,
        value: item.value,
        children: [],
        rootChildId: currentNode.isRoot() ? item.id : currentNode.rootChildId,
      });
      itemNode.id = item.id;
      itemNode.focusOnMount = false;

      currentNode.serverAppendChild(itemNode, index);
      break;
    }
    default:
      throw new Error("Invalid node type");
  }
};

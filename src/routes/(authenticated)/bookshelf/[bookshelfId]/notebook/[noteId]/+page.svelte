<script lang="ts">
  import { env } from "$env/dynamic/public";
  import RootNode from "$lib/block/RootNode/RootNode.svelte";
  import { type RootNodePayload } from "$lib/block/RootNode/payload.svelte";
  import { RootNodeClass } from "$lib/block/RootNode/types.svelte";
  import * as Button from "$lib/components/ui/button";
  import Mic from "$lib/icons/Mic.svelte";
  import Micoff from "$lib/icons/Micoff.svelte";
  import type { PageData } from "./$types";

  type NoteMessage = {
    type: "note";
    payload: RootNodePayload;
  };

  let { data } = $props<{
    data: PageData;
  }>();

  let rootNode = $state<RootNodeClass | null>(null);
  let isMicOn = $state(false);

  let ws: WebSocket;
  $effect(() => {
    ws = new WebSocket(
      `${env.PUBLIC_WS_URL}/bookshelves/${data.props.bookshelfId}/notes/${data.props.noteId}/ws`,
    );
    ws.onopen = () => {
      ws.send(
        JSON.stringify({ type: "init", payload: data.props.sessionToken }),
      );
    };

    ws.onmessage = (event) => {
      let message = JSON.parse(event.data) as NoteMessage;
      if (message.type === "note") {
        rootNode = RootNodeClass.load(message.payload);
      }
    };

    return () => {
      ws.close();
    };
  });

  $effect(() => {
    const intervalId = setInterval(() => {
      //   if (this.updateTitle) {
      //   this.updateTitle = false;
      // }

      if (rootNode == null) {
        return;
      }

      if (rootNode.updateAll) {
        const payload = rootNode.dumpAll();

        console.log(payload.children);

        ws.send(
          JSON.stringify({
            type: "update all",
            payload: payload.children,
          }),
        );
        rootNode.updateAll = false;
        rootNode.needUpdateIds.clear();

        console.log("updated all!");

        return;
      }

      for (const childId of rootNode.needUpdateIds) {
        const node = rootNode.children.find((child) => child.id === childId);
        if (!node) {
          continue;
        }

        ws.send(
          JSON.stringify({
            type: "update",
            payload: {
              index: node.index,
              content: node.dump(),
            },
          }),
        );
      }
      console.log("updated!");

      rootNode.needUpdateIds.clear();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });
</script>

{#if rootNode}
  <RootNode node={rootNode} />
{:else}
  <div class="flex h-full items-center justify-center">
    <div class="text-2xl font-bold">Loading...</div>
  </div>
{/if}

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

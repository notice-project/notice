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

  let noteWS: WebSocket;
  $effect(() => {
    noteWS = new WebSocket(
      `${env.PUBLIC_WS_URL}/bookshelves/${data.props.bookshelfId}/notes/${data.props.noteId}/ws`,
    );
    noteWS.onopen = () => {
      noteWS.send(
        JSON.stringify({ type: "init", payload: data.props.sessionToken }),
      );
    };

    noteWS.onmessage = (event) => {
      let message = JSON.parse(event.data) as NoteMessage;
      if (message.type === "note") {
        rootNode = RootNodeClass.load(message.payload);
      }
    };

    return () => {
      noteWS.close();
    };
  });

  $effect(() => {
    const intervalId = setInterval(() => {
      if (rootNode == null) {
        return;
      }

      if (rootNode.updateTitle) {
        noteWS.send(
          JSON.stringify({
            type: "update title",
            payload: rootNode.value,
          }),
        );
        rootNode.updateTitle = false;

        console.log("updated title!");
      }

      if (rootNode.updateAll) {
        const payload = rootNode.dumpAll();

        noteWS.send(
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

        noteWS.send(
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

<div class="flex w-full justify-center">
  <div class="mx-10 flex w-full max-w-4xl flex-col">
    {#if rootNode}
      <RootNode node={rootNode} />
    {:else}
      <div class="text-2xl font-bold">Loading...</div>
    {/if}
  </div>
</div>

{#if rootNode}
  <div class="flex w-full items-center justify-center">
    <div class="mt-8 flex w-full max-w-4xl items-center justify-center">
      <div class="ml-4 flex-grow border-t border-[#D9D9D9]" />
      <Button.Root
        variant="outline"
        class=" w-full max-w-lg rounded-none border-[#D9D9D9] text-[#B0B0B0] hover:bg-[#D9D9D9] hover:text-white"
        onclick={() => {
          // noop
        }}
      >
        Notice Me!
      </Button.Root>
      <div class="mr-4 flex-grow border-t border-[#D9D9D9]" />
    </div>
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

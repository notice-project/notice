<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { BlockNodeClass } from "$lib/block/BlockNode/types.svelte";
  import { GenNodeClass } from "$lib/block/GenNode/types.svelte";
  import RootNode from "$lib/block/RootNode/RootNode.svelte";
  import { type RootNodePayload } from "$lib/block/RootNode/payload.svelte";
  import { RootNodeClass } from "$lib/block/RootNode/types.svelte";
  import * as Button from "$lib/components/ui/button";
  import Mic from "$lib/icons/Mic.svelte";
  import Micoff from "$lib/icons/Micoff.svelte";

  import { insertMessageHandler, type InsertMessage } from "$lib/api/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  type NoteWSMessage = NoteMessage | UpdateMessage;

  type NoteMessage = {
    type: "note";
    payload: RootNodePayload;
  };

  type UpdateMessage = {
    type: "generated";
    payload:
      | {
          finished: false;
          content: InsertMessage;
        }
      | {
          finished: true;
        };
  };

  let { data } = $props<{
    data: PageData;
  }>();

  let rootNode = $state<RootNodeClass | null>(null);

  let noteWS = $state<WebSocket | null>(null);
  let isGenerating = $state(false);

  onMount(() => {
    noteWS = new WebSocket(
      `${env.PUBLIC_WS_URL}/bookshelves/${data.props.bookshelfId}/notes/${data.props.noteId}/ws`,
    );
    noteWS.onopen = () => {
      noteWS?.send(
        JSON.stringify({ type: "init", payload: data.props.sessionToken }),
      );
    };

    noteWS.onmessage = (event) => {
      let message = JSON.parse(event.data) as NoteWSMessage;

      switch (message.type) {
        case "note":
          rootNode = RootNodeClass.load(message.payload);
          break;
        case "generated":
          if (rootNode == null) {
            return;
          }

          if (message.payload.finished) {
            isGenerating = false;
            for (const child of rootNode.children) {
              if (child instanceof GenNodeClass) {
                rootNode.removeChild(child.id);
              }
            }
            break;
          }

          insertMessageHandler(message.payload.content, rootNode);
      }
    };

    return () => {
      noteWS?.close();
    };
  });

  $effect(() => {
    const intervalId = setInterval(() => {
      if (rootNode == null) {
        return;
      }

      if (rootNode.updateTitle) {
        noteWS?.send(
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

        noteWS?.send(
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

        noteWS?.send(
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
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  });

  let isMicOn = $state(false);
  let microphoneWS = $state<WebSocket | null>(null);

  onMount(() => {
    microphoneWS = new WebSocket(
      `${env.PUBLIC_WS_URL}/bookshelves/${data.props.bookshelfId}/notes/${data.props.noteId}/transcription/ws`,
    );

    microphoneWS.onopen = () => {
      console.log("microphoneWS opened!");
      microphoneWS?.send(
        JSON.stringify({ type: "init", payload: data.props.sessionToken }),
      );
    };

    return () => {
      microphoneWS?.close();
    };
  });

  let mediaRecorder = $state<MediaRecorder | null>(null);
  onMount(() => {
    const genMediaRecorder = async () => {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(media);
      mediaRecorder.ondataavailable = (e) => {
        microphoneWS?.send(e.data);
      };
      mediaRecorder.onstop = () => {
        microphoneWS?.send(
          JSON.stringify({
            type: "stop",
          }),
        );
      };
    };

    genMediaRecorder();

    return () => {
      mediaRecorder?.stop();
    };
  });
</script>

{#if rootNode}
  <div class="flex w-full justify-center">
    <div class="mx-10 flex w-full max-w-4xl flex-col">
      <RootNode node={rootNode} />
    </div>
  </div>
{:else}
  <div
    class="flex h-full w-full flex-grow flex-col items-center justify-center"
  >
    <div class="text-2xl font-bold">Loading...</div>
  </div>
{/if}

{#if rootNode}
  <div class="flex w-full items-center justify-center">
    <div class="mt-8 flex w-full max-w-4xl items-center justify-center">
      <div class="ml-4 flex-grow border-t border-[#D9D9D9]" />
      {#if !isGenerating}
        <Button.Root
          variant="outline"
          class=" w-full max-w-lg rounded-none border-[#D9D9D9] text-[#B0B0B0] hover:bg-[#D9D9D9] hover:text-white"
          onclick={() => {
            if (rootNode == null) {
              return;
            }

            noteWS?.send(
              JSON.stringify({
                type: "notice me",
                payload: rootNode.children.length,
              }),
            );

            isGenerating = true;
            const genNode = new GenNodeClass();
            rootNode.serverAppendChild(genNode, rootNode.children.length);

            const nextNode = new BlockNodeClass({
              value: "",
              children: [],
              rootChildId: "",
              root: rootNode,
              parent: rootNode,
            });
            rootNode.appendChild(nextNode, rootNode.children.length);
          }}
        >
          Notice Me!
        </Button.Root>
      {/if}
      <div class="mr-4 flex-grow border-t border-[#D9D9D9]" />
    </div>
  </div>
{/if}

<Button.Root
  variant="outline"
  size="icon"
  class="fixed bottom-8 right-8 rounded-full"
  onclick={() => {
    if (isMicOn) {
      mediaRecorder?.stop();
      microphoneWS?.send(
        JSON.stringify({
          type: "stop",
        }),
      );
    } else {
      mediaRecorder?.start(1000);
      microphoneWS?.send(
        JSON.stringify({
          type: "start",
        }),
      );
    }

    isMicOn = !isMicOn;
  }}
>
  {#if isMicOn}
    <Mic />
  {:else}
    <Micoff />
  {/if}
</Button.Root>

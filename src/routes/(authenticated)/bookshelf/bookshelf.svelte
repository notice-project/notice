<script lang="ts">
  import { api } from "$lib/api";
  import * as Accordion from "$lib/components/ui/accordion";
  import * as Button from "$lib/components/ui/button";
  import {
    createInfiniteQuery,
    createMutation,
    useQueryClient,
  } from "@tanstack/svelte-query";

  let { title, count, id, sessionToken } = $props<{
    title: string;
    count: number;
    id: string;
    sessionToken: string;
  }>();

  let isOpen = $state(false);

  const noteQuery = $derived(
    createInfiniteQuery({
      queryKey: [{ scope: "notes", id }],
      queryFn: async ({ pageParam: cursor }) => {
        const res = await api.GET("/bookshelves/{bookshelf_id}/notes/", {
          params: {
            path: { bookshelf_id: id },
            query: { cursor },
          },
          headers: {
            "X-Session-Token": sessionToken,
          },
        });
        if (res.error) throw res.error;
        return res.data;
      },
      getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined,
      initialPageParam: null as string | null,
      enabled: isOpen,
    }),
  );

  let isAddingNote = $state(false);
  let newNoteTitle = $state("");

  const queryClient = useQueryClient();

  const createNote = createMutation({
    mutationFn: async (title: string) => {
      const res = await api.POST("/bookshelves/{bookshelf_id}/notes/", {
        params: {
          path: { bookshelf_id: id },
        },
        headers: {
          "X-Session-Token": sessionToken,
        },
        body: {
          title,
        },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [{ scope: "notes", id }] });
    },
  });

  const addNote = async () => {
    $createNote.mutate(newNoteTitle, {
      onSuccess: () => {
        isAddingNote = false;
        newNoteTitle = "";
      },
    });
  };
</script>

<Accordion.Item value={id} data-state={isOpen ? "open" : "closed"}>
  <Accordion.Trigger
    class="mt-7 flex items-start justify-between gap-5 bg-zinc-100 px-7 py-6 shadow-sm max-md:max-w-full max-md:flex-wrap max-md:px-5"
    onclick={() => (isOpen = !isOpen)}
  >
    <div class="text-xl font-bold text-neutral-700">{title}</div>
    <div class="text-l text-right text-zinc-500">{count} notebooks</div>
  </Accordion.Trigger>
  <Accordion.Content>
    {#if $noteQuery.isPending}
      <div class="flex h-32 items-center justify-center py-4">
        <div
          class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-zinc-500"
        ></div>
      </div>
    {:else if $noteQuery.isError}
      <div class="flex h-32 items-center justify-center">
        <div class="text-2xl text-red-500">Error</div>
      </div>
    {:else}
      {#each $noteQuery.data.pages ?? [] as page}
        {#each page.data as note (note.id)}
          <a
            class="flex items-start justify-between gap-5 bg-zinc-100 px-7 py-6 text-lg font-semibold shadow-sm max-md:max-w-full max-md:flex-wrap max-md:px-5"
            href="/bookshelf/{id}/notebook/{note.id}"
          >
            {note.title}
          </a>
        {/each}
      {/each}
    {/if}
    {#if isAddingNote}
      <form
        onsubmit={(e) => {
          e.preventDefault();
          addNote();
        }}
        class="mt-7 flex w-full gap-2 border-[3px] border-dashed border-zinc-300 px-4 py-5 text-xl max-md:max-w-full max-md:px-5"
      >
        <input
          type="text"
          placeholder="Title of your new notebook"
          bind:value={newNoteTitle}
          class="flex-grow p-1 focus:outline-none"
        />
        <Button.Root variant="default">Add</Button.Root>
        <Button.Root variant="secondary" onclick={() => (isAddingNote = false)}>
          Cancel
        </Button.Root>
      </form>
    {:else}
      <button
        onclick={() => {
          isAddingNote = true;
        }}
        class="flex w-full items-center justify-center whitespace-nowrap border-[3px] border-dashed border-zinc-300 px-5 py-6 text-xl text-zinc-300 max-md:max-w-full max-md:px-5"
      >
        +
      </button>
    {/if}
  </Accordion.Content>
</Accordion.Item>

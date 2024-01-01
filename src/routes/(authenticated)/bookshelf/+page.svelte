<script lang="ts">
  import { api } from "$lib/api";
  import type { paths } from "$lib/api/schema";
  import * as Accordion from "$lib/components/ui/accordion";
  import * as Button from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  import {
    createInfiniteQuery,
    createMutation,
    useQueryClient,
  } from "@tanstack/svelte-query";
  import { ArrowDown, ArrowUp } from "lucide-svelte";
  import type { PageData } from "./$types";
  import Bookshelf from "./bookshelf.svelte";

  let { data } = $props<{
    data: PageData;
  }>();

  type GetBookshelvesQuery = NonNullable<
    paths["/bookshelves/"]["get"]["parameters"]["query"]
  >;
  let sort = $state<GetBookshelvesQuery["sort"]>("created_at");
  let order = $state<GetBookshelvesQuery["order"]>("asc");

  const setSort = (newSort: GetBookshelvesQuery["sort"]) => {
    sort = newSort;
  };

  const toggleOrder = () => {
    order = order === "asc" ? "desc" : "asc";
  };

  let bookshelvesQuery = $derived(
    createInfiniteQuery({
      queryKey: [{ scope: "bookshelves", sort, order }],
      queryFn: async ({ pageParam: cursor }) => {
        const res = await api.GET("/bookshelves/", {
          params: {
            query: { cursor, sort, order },
          },
          headers: {
            "X-Session-Token": data.props.sessionToken,
          },
        });
        if (res.error) throw res.error;
        return res.data;
      },
      getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined,
      initialPageParam: null as string | null,
    }),
  );

  const queryClient = useQueryClient();

  const createBookshelf = createMutation({
    mutationFn: async (title: string) => {
      const res = await api.POST("/bookshelves/", {
        headers: {
          "X-Session-Token": data.props.sessionToken,
        },
        body: { title },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [{ scope: "bookshelves" }] });
    },
  });

  let isAddingBookshelf = $state(false);
  let newBookshelfTitle = $state("");
  const addBook = () => {
    $createBookshelf.mutate(newBookshelfTitle, {
      onSuccess: () => {
        isAddingBookshelf = false;
        newBookshelfTitle = "";
      },
    });
  };
</script>

<div
  class="flex flex-col items-center justify-center bg-white px-16 py-12 max-md:px-5"
>
  <div
    class="mb-20 mt-20 flex w-[808px] max-w-full flex-col items-stretch max-md:my-10"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-4xl font-bold text-neutral-700">Bookshelf</h2>
      <div class="flex items-center gap-2">
        <Select.Root portal={null}>
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Sort by" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              value="created_at"
              onclick={() => setSort("created_at")}
            >
              Sort by Creation Time
            </Select.Item>
            <Select.Item value="title" onclick={() => setSort("title")}>
              Sort by Title
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <Button.Root
          variant="outline"
          class="flex items-center gap-2"
          onclick={toggleOrder}
        >
          {#if order === "asc"}
            <span>Ascending</span>
            <ArrowUp size={16} />
          {:else if order === "desc"}
            <span>Descending</span>
            <ArrowDown size={16} />
          {/if}
        </Button.Root>
      </div>
    </div>

    {#if $bookshelvesQuery.isError}
      <div class="text-red-500">{$bookshelvesQuery.error.message}</div>
    {:else if $bookshelvesQuery.isLoading}
      <div class="text-neutral-500">Loading...</div>
    {:else}
      <Accordion.Root
        class="flex h-full flex-col items-stretch overflow-y-clip"
      >
        {#each $bookshelvesQuery.data?.pages ?? [] as { data: bookshelves }}
          {#each bookshelves as bookshelf (bookshelf.id)}
            <Bookshelf
              id={bookshelf.id}
              title={bookshelf.title}
              count={bookshelf.count}
              sessionToken={data.props.sessionToken}
            />
          {/each}
        {/each}
      </Accordion.Root>
    {/if}

    {#if isAddingBookshelf}
      <form
        onsubmit={(e) => {
          e.preventDefault();
          addBook();
        }}
        class="mt-7 flex w-full gap-2 border-[3px] border-dashed border-zinc-300 px-4 py-5 text-xl max-md:max-w-full max-md:px-5"
      >
        <input
          type="text"
          placeholder="Title of your new bookshelf"
          bind:value={newBookshelfTitle}
          class="flex-grow p-1 focus:outline-none"
        />
        <Button.Root variant="default">Add</Button.Root>
        <Button.Root
          variant="secondary"
          onclick={() => (isAddingBookshelf = false)}
        >
          Cancel
        </Button.Root>
      </form>
    {:else}
      <button
        onclick={() => {
          isAddingBookshelf = true;
        }}
        class="mt-7 flex items-center justify-center whitespace-nowrap border-[3px] border-dashed border-zinc-300 px-5 py-6 text-xl text-zinc-300 max-md:max-w-full max-md:px-5"
      >
        +
      </button>
    {/if}
  </div>
</div>

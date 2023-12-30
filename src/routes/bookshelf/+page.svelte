<script lang="ts">
  import Bookshelf from "./bookshelf.svelte";

  let selectedBook: string | null = null;
  let books: { title: string; count: number }[] = [
    { title: "HCI", count: 3 },
    { title: "SA", count: 7 },
    { title: "Compiler", count: 11 },
  ];

  const click = (book: string | null) => {
    selectedBook = book;
  };

  const addBook = () => {
    const newBookTitle = prompt("Title of your new book:");
    if (newBookTitle) books = [...books, { title: newBookTitle, count: 0 }];
  };
</script>

<div
  class="flex flex-col items-center justify-center bg-white px-16 py-12 max-md:px-5"
>
  <div
    class="mb-20 mt-20 flex w-[808px] max-w-full flex-col items-stretch max-md:my-10"
  >
    <div class="text-4xl font-bold text-neutral-700">Bookshelf</div>

    {#each books as { title, count } (title)}
      <Bookshelf
        onclick={() => click(title)}
        selected={selectedBook === title}
        {title}
        {count}
      />
    {/each}

    <button
      onclick={addBook}
      class="mt-7 flex items-center justify-center whitespace-nowrap border-[3px] border-dashed border-zinc-300 px-16 py-5 text-xl text-zinc-300 max-md:max-w-full max-md:px-5"
    >
      +
    </button>
  </div>
</div>

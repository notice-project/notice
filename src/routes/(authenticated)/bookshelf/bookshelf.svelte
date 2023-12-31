<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  let { onclick, selected, title, count } = $props<{
    onclick?: MouseEventHandler<HTMLButtonElement> | undefined | null;
    selected?: boolean;
    title: string;
    count: number;
  }>();
</script>

<button
  {onclick}
  class:background-selected={selected}
  class="mt-7 flex items-start justify-between gap-5 bg-zinc-100 px-7 py-6 shadow-sm max-md:max-w-full max-md:flex-wrap max-md:px-5"
>
  <div class="text-xl font-bold text-neutral-700">{title}</div>
  <div class="text-l text-right text-zinc-500">{count} notebooks</div>
</button>

<style>
  .background-selected {
    background-color: rgb(255, 221, 209);
  }
</style>

<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion";

  let { selected, noteTitle, count } = $props<{
    selected?: boolean;
    noteTitle: string;
    noteNames: string[];
    count: number;
  }>();
</script>

<Accordion.Root
  class="flex flex-col items-center justify-center bg-white px-16 py-12 max-md:px-5"
>
  <Accordion.Item value="Book 1">
    <Accordion.Trigger class="text-xl font-bold text-neutral-700">
      {noteTitle}
    </Accordion.Trigger>

    {#each noteNames as noteName (noteName)}
      <Accordion.Content>
        <button>
          <div class="text-xl font-bold text-neutral-700">{noteName}</div>
        </button>
      </Accordion.Content>
    {/each}
  </Accordion.Item>
</Accordion.Root>

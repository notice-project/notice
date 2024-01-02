<script lang="ts">
  import Pencil from "$lib/icons/Pencil.svelte";
</script>

<div class="flex items-center gap-2">
  <div class="animate-swing">
    <Pencil />
  </div>
  <div
    class="m-1 flex h-8 w-full max-w-2xl animate-pulse items-center rounded-full bg-gray-200 px-4"
  >
    Generating...
  </div>
  <!-- <Skeleton class="m-1 h-8 w-full max-w-2xl rounded-full" /> -->
</div>

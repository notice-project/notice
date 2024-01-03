<script lang="ts">
  import Pencil from "$lib/icons/Pencil.svelte";
  import Typed from "typed.js";

  $effect(() => {
    const typed = new Typed("#typing", {
      strings: ["Generating..."],
      loop: true,
      typeSpeed: 200,
      fadeOut: true,
      fadeOutDelay: 1000,
    });

    return () => {
      typed.destroy();
    };
  });
</script>

<div class="flex items-center gap-2">
  <div class="animate-swing">
    <Pencil />
  </div>
  <div
    class="m-1 flex h-8 w-full max-w-2xl animate-pulse items-center rounded-full bg-gray-200 px-4"
  >
    <span id="typing"></span>
  </div>
</div>

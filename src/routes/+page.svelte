<script lang="ts">
  import { page } from "$app/stores";
  import * as Button from "$lib/components/ui/button";
  import NoticeIcon from "$lib/icons/notice.svelte";
</script>

<main
  class="container flex h-full w-full flex-col items-center justify-center gap-16"
>
  <div class="flex flex-col items-center gap-4">
    <NoticeIcon width={128} height={128} />
    <h1 class="text-5xl font-bold tracking-tighter">Not!ce</h1>
    <p class="text-xl font-semibold">
      <span
        class="bg-gradient-to-tr from-[#100c0c] to-[#ffe372] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent"
      >
        AI-powered
      </span>
      note-taking app that helps you take notes faster and more efficiently.
    </p>
  </div>

  <div class="flex justify-center gap-4">
    {#if $page.data.session?.user}
      <Button.Root href="/bookshelf">My Notes</Button.Root>
    {:else}
      <Button.Root href="/sign-in">Login</Button.Root>
    {/if}

    <Button.Root
      href="https://github.com/notice-project/notice"
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
    >
      Source Code
    </Button.Root>
  </div>
</main>

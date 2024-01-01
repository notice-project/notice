<script lang="ts">
  import * as Button from "$lib/components/ui/button";
  import NoticeIcon from "$lib/icons/notice.svelte";
  import { signOut } from "@auth/sveltekit/client";
  import { LogOut } from "lucide-svelte";
</script>

<main class="h-full w-full">
  <header class="sticky top-0 w-full border-b">
    <div class="container flex h-14 items-center justify-between">
      <div class="flex gap-4">
        <a href="/" class="flex items-center space-x-2">
          <NoticeIcon />
          <span class="hidden text-lg font-bold tracking-tight md:inline-block">
            Not!ce
          </span>
        </a>
        <a href="/bookshelf" class="flex hover:underline">
          <span class="flex items-center text-gray-600"> Bookshelf </span>
        </a>
      </div>

      <Button.Root
        onclick={() => signOut()}
        variant="secondary"
        class="space-x-2"
      >
        <span>Logout</span>
        <LogOut class="h-4 w-4" />
      </Button.Root>
    </div>
  </header>

  <slot />
</main>

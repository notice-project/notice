<script lang="ts">
  import { page } from "$app/stores";
  import { signOut } from "@auth/sveltekit/client";

  let name = $state("Not!ce");
</script>

<div class="flex h-full flex-col items-center justify-center gap-6">
  <h1 class="text-5xl font-semibold tracking-tight text-gray-600">
    Welcome to {name}
  </h1>
  <p>Here is nothing. Go develop something!</p>
  <div>
    <label for="name">Project Name:</label>
    <input type="text" bind:value={name} class="border" />
  </div>

  {#if $page.data.session?.user}
    <pre>{JSON.stringify($page.data.session.user, null, 2)}</pre>
    <button onclick={() => signOut()}>Logout</button>

    <form method="post">
      <button formaction="?/testCookies">Test Cookies</button>
    </form>
  {:else}
    <a href="/sign-in">Sign In</a>
  {/if}
</div>

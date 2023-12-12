<script lang="ts">
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
</div>

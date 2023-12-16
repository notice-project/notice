<script lang="ts">
  //   import GoogleLogo from "virtual:icons/logos/google-icon";
  //   import ArrowRight from "virtual:icons/radix-icons/arrow-right";
  import GoogleLogo from "$lib/icons/google.svelte";
  import NYCULogo from "$lib/icons/nycu.svelte";
  import { ArrowRight } from "lucide-svelte";
</script>

<main class="flex h-full w-full items-center justify-center bg-purple-400">
  <form
    method="post"
    class="flex w-[400px] flex-col gap-8 rounded-md bg-white px-8 py-9"
  >
    <h1 class="text-2xl font-bold">Not!ce</h1>
    <div>
      <h2 class="mb-1 text-xl font-bold">Sign in</h2>
      <p class="text-gray-600">to continue to Not!ce</p>
    </div>
    <div class="flex flex-col gap-2">
      <div class="w-full">
        <button
          formaction="?/google"
          class="group inline-flex w-full items-center gap-4 rounded-md border px-6 py-3 text-left hover:bg-gray-100"
        >
          <div class="flex-shrink-0">
            <GoogleLogo height={20} width={20} />
          </div>
          <spna class="w-full text-sm font-normal">Continue with Google</spna>
          <ArrowRight
            class="h-4 w-4 flex-shrink-0 text-gray-500 transition group-hover:translate-x-2"
          />
        </button>
      </div>
      <div>
        <div class="w-full">
          <button
            formaction="?/nycu"
            class="group inline-flex w-full items-center gap-4 rounded-md border px-6 py-3 text-left hover:bg-gray-100"
          >
            <div class="flex-shrink-0">
              <NYCULogo height={20} width={20} />
            </div>
            <spna class="w-full text-sm font-normal">Continue with NYCU</spna>
            <ArrowRight
              class="h-4 w-4 flex-shrink-0 text-gray-500 transition group-hover:translate-x-2"
            />
          </button>
        </div>
      </div>
    </div>
  </form>
</main>

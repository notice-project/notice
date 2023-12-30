<script lang="ts">
  import GoogleLogo from "$lib/icons/google.svelte";
  import NoticeLogo from "$lib/icons/notice.svelte";
  import NYCULogo from "$lib/icons/nycu.svelte";
  import { signIn } from "@auth/sveltekit/client";
  import { ArrowRight } from "lucide-svelte";
</script>

<main class="relative flex h-full w-full items-center justify-center">
  <div class="absolute inset-0 -z-10 h-full w-full">
    <enhanced:img
      src="$lib/images/sign-in/background.svg"
      alt="Background"
      class="absolute inset-0 h-full w-full object-cover"
    />
  </div>
  <section
    class="flex w-[400px] flex-col gap-8 rounded-md bg-white px-8 py-9 shadow-md"
  >
    <div class="flex items-center gap-2">
      <NoticeLogo height={40} width={40} />

      <enhanced:img
        src="$lib/images/sign-in/heading.svg"
        alt="Heading"
        class="h-8"
        draggable="false"
      />
    </div>
    <div>
      <h2 class="mb-1 text-xl font-bold">Sign in</h2>
      <p class="text-gray-600">to continue to Not!ce</p>
    </div>
    <div class="flex flex-col gap-2">
      <div class="w-full">
        <button
          class="group inline-flex w-full items-center gap-4 rounded-md border px-6 py-3 text-left hover:bg-gray-100"
          onclick={() => signIn("google")}
        >
          <div class="flex-shrink-0">
            <GoogleLogo height={20} width={20} />
          </div>
          <span class="w-full text-sm font-normal">Continue with Google</span>
          <ArrowRight
            class="h-4 w-4 flex-shrink-0 text-gray-500 opacity-0 transition group-hover:translate-x-2 group-hover:opacity-100"
          />
        </button>
      </div>
      <div>
        <div class="w-full">
          <button
            onclick={() => signIn("nycu")}
            class="group inline-flex w-full items-center gap-4 rounded-md border px-6 py-3 text-left hover:bg-gray-100"
          >
            <div class="flex-shrink-0">
              <NYCULogo height={20} width={20} />
            </div>
            <span class="w-full text-sm font-normal">Continue with NYCU</span>
            <ArrowRight
              class="h-4 w-4 flex-shrink-0 text-gray-500 opacity-0 transition group-hover:translate-x-2 group-hover:opacity-100"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</main>

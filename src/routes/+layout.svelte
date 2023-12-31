<script lang="ts">
  import { browser } from "$app/environment";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import "../app.css";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
  <SvelteQueryDevtools />
</QueryClientProvider>

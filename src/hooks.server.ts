import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import NYCU from "$lib/auth/providers/nycu";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { db } from "./server/db";

const handleAuth = SvelteKitAuth(async () => {
  return {
    trustHost: true,
    secret: env.AUTH_SECRET ?? "secret",
    adapter: DrizzleAdapter(db),
    providers: [
      Google({
        clientId: env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      }),
      NYCU({
        clientId: env.NYCU_OAUTH_CLIENT_ID,
        clientSecret: env.NYCU_OAUTH_CLIENT_SECRET,
      }),
    ],
  };
});

export const handle: Handle = async ({ event, resolve }) => {
  if (building) {
    const response = await resolve(event);
    return response;
  }

  return handleAuth({ event, resolve });
};

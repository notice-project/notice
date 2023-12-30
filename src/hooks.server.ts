import { env } from "$env/dynamic/private";
import NYCU from "$lib/auth/providers/nycu";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import { db } from "./server/db";

export const handle = SvelteKitAuth(async () => {
  return {
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

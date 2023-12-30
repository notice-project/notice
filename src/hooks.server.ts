import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  NYCU_OAUTH_CLIENT_ID,
  NYCU_OAUTH_CLIENT_SECRET,
} from "$env/static/private";
import NYCU from "$lib/auth/providers/nycu";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SvelteKitAuth } from "@auth/sveltekit";
import { db } from "./server/db";

export const handle = SvelteKitAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    }),
    NYCU({
      clientId: NYCU_OAUTH_CLIENT_ID,
      clientSecret: NYCU_OAUTH_CLIENT_SECRET,
    }),
  ],
});

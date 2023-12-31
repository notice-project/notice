import { AuthCookies } from "$lib/auth/cookies";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  testCookies: async (event) => {
    const sessionToken = event.cookies.get(AuthCookies.sessionToken);
    console.log("sessionToken", sessionToken);
  },
};

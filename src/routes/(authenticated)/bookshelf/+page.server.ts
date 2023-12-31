import { AuthCookies } from "$lib/auth/cookies";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionToken = cookies.get(AuthCookies.sessionToken)!;
  return { props: { sessionToken } };
};

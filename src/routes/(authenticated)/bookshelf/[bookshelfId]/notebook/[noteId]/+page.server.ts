import { AuthCookies } from "$lib/auth/cookies";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params, cookies }) => {
  const sessionToken = cookies.get(AuthCookies.sessionToken);
  return {
    props: {
      bookshelfId: params.bookshelfId,
      noteId: params.noteId,
      sessionToken,
    },
  };
};

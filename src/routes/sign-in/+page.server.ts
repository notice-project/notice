import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  const session = await event.locals.getSession();
  if (session?.user) {
    return redirect(301, "/");
  }
};

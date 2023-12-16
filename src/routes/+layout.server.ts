import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  if (event.route.id === "/sign-in") {
    return;
  }

  const sessionId = event.cookies.get("sessionId");

  if (!sessionId) {
    redirect(301, "/sign-in");
  }

  // get user info from server
};

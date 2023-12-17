import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("sessionId");

  if (!sessionId && event.url.pathname !== "/sign-in") {
    redirect(301, "/sign-in");
  }
  // get user info from db

  const response = await resolve(event);

  return response;
};

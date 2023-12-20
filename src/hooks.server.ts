import { building } from "$app/environment";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (building) {
    return resolve(event);
  }

  const sessionId = event.cookies.get("sessionId");

  if (!sessionId && event.url.pathname !== "/sign-in") {
    redirect(301, "/sign-in");
  }
  // get user info from db

  const response = await resolve(event);

  return response;
};

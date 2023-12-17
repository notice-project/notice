import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  if (event.cookies.get("sessionId")) {
    redirect(301, "/");
  }
};

export const actions = {
  google: async ({ fetch }) => {
    const response = await fetch(
      "https://notice-api.lilun.dev/auth/login/google",
    );
    console.log(response);
  },
  nycu: async () => {
    console.log("nycu");
  },
};

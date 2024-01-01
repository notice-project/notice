import { env } from "$env/dynamic/public";
import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: env.PUBLIC_API_URL,
});

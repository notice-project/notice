import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "./connection";

const connection = await createConnection();
export const db = drizzle(connection);

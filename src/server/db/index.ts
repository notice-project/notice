import { building } from "$app/environment";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createConnection } from "./connection";

const createDB = async () => {
  if (building) {
    return null as unknown as MySql2Database;
  }
  const connection = await createConnection();
  return drizzle(connection);
};

export const db = await createDB();

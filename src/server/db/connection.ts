import type { ConnectionOptions as MySQL2ConnectionOptions } from "mysql2";
import mysql from "mysql2/promise";

type ConnectionOptions = Omit<
  MySQL2ConnectionOptions,
  "user" | "password" | "database" | "host" | "port"
>;

export const createConnection = async (options?: ConnectionOptions) => {
  const connection = await mysql.createConnection({
    user: process.env.MYSQL_USER ?? "app",
    password: process.env.MYSQL_PASSWORD ?? "app",
    database: process.env.MYSQL_DATABASE ?? "db",
    host: process.env.MYSQL_HOST ?? "localhost",
    port: parseInt(process.env.MYSQL_PORT ?? "3306"),
    ...options,
  });
  return connection;
};

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    user: process.env.MYSQL_USER ?? "app",
    password: process.env.MYSQL_PASSWORD ?? "app",
    database: process.env.MYSQL_DATABASE ?? "db",
    host: process.env.MYSQL_HOST ?? "localhost",
    port: Number(process.env.MYSQL_PORT ?? 3306),
  },
} satisfies Config;

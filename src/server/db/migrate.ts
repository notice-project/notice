import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "$env/static/private";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    host: MYSQL_HOST,
    port: parseInt(MYSQL_PORT),
    connectionLimit: 1,
  });
  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("🎉 Migration has finished successfully!");

  await connection.end();
}

main().catch((err) => {
  console.error(`❌ Failed to migrate database: ${err.message}`);
  process.exit(1);
});

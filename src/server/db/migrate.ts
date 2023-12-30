import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
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

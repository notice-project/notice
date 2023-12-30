import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "./connection";

async function main() {
  const connection = await createConnection({ connectionLimit: 1 });
  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("🎉 Migration has finished successfully!");

  await connection.end();
}

main().catch((err) => {
  console.error(`❌ Failed to migrate database: ${err.message}`);
  process.exit(1);
});

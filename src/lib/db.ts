import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (pool) return pool;

  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || "localhost";
  const port = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);

  if (!database || !user || !password) {
    throw new Error(
      "Database env is missing. Set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD."
    );
  }

  pool = mysql.createPool({
    host,
    port,
    database,
    user,
    password,
    waitForConnections: true,
    connectionLimit: 6,
    namedPlaceholders: true,
    charset: "utf8mb4",
  });

  return pool;
}

export type DbRow = Record<string, unknown>;


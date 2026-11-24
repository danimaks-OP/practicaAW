// Conexión a MariaDB mediante un pool de conexiones (parte 1/2)
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "aw_practica",
  connectionLimit: 10,
  acquireTimeout: 5000, // si MariaDB no responde, error a los 5 s (por defecto son 10 s)
  dateStrings: true, // DATE y DATETIME llegan como texto ("2026-01-15"): sin desfases de zona horaria
  bigIntAsNumber: true, // COUNT(*) llega como Number y no como BigInt (JSON no sabe convertir BigInt)
  insertIdAsNumber: true, // el id generado por un INSERT también llega como Number
});

export default pool;
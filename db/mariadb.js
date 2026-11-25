// Conexión a MariaDB mediante un pool de conexiones
import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    bigIntAsNumber: true,
    dateStrings: true
});

export async function query(sql, params) {
    const conn = await pool.getConnection();
    try {
        return await conn.query(sql, params);
    } finally {
        conn.release();
    }
}
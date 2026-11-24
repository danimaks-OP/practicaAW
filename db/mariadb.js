import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function query(sql, params){
    const connection = await pool.getConnection();
    try{
        return await connection.query(sql, params);
    }catch(e){
        throw new Error(`Data Base Error: ${e}`);
    }finally{
        await connection.release();
    }
}

module.exports = query;
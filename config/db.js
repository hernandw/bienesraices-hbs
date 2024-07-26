/* import pg from 'pg';
import 'dotenv/config'
const { Pool } = pg;

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const config = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    allowExitOnIdle: true,
    sslmode: "require"
}


export const pool = new Pool(config)

try {
    await pool.query('SELECT NOW()')
    console.log('Database connected')
} catch (error) {
    console.log({
        error: error.message,
        message: 'Error connecting to database'
    })
} */

    import pg from 'pg';
    import 'dotenv/config';
    
    const { Pool } = pg;
    
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
    
    const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?sslmode=require`;
    
    export const pool = new Pool({
      allowExitOnIdle: true,
      connectionString,
    });
    
    try {
      await pool.query('SELECT NOW()');
      console.log('Database connected');
    } catch (error) {
      console.log(error);
    }
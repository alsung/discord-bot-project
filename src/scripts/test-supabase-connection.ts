import pool from '../database/database';

(async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected successfully. Current time: ', result.rows[0].now);
    } catch (err) {
        console.error('Failed to connect to database:', err);
    } finally {
        await pool.end(); // Close the connection pool
    }
})();
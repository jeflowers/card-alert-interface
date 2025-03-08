/**
 * Database Configuration - Configures the connection to the Oracle database
 */

const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config();

// Oracle connection pool configuration
let pool;

async function initialize() {
  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1
    });
    
    console.log('Oracle database connection pool initialized successfully');
  } catch (error) {
    console.error('Error initializing Oracle connection pool:', error);
    throw error;
  }
}

// Initialize the pool when this module is loaded
initialize();

// Database query wrapper
async function query(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Set output format to objects
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };
    
    const result = await connection.execute(sql, params, options);
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// Close the pool (call when shutting down the application)
async function close() {
  try {
    await pool.close();
    console.log('Oracle connection pool closed');
  } catch (error) {
    console.error('Error closing Oracle connection pool:', error);
    throw error;
  }
}

module.exports = { query, close };
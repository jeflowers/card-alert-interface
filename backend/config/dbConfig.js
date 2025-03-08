const oracledb = require('oracledb');
require('dotenv').config();

class DatabaseConfig {
  static async initialize() {
    try {
      await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1
      });
      console.log('Database connection pool created successfully');
    } catch (error) {
      console.error('Error creating database connection pool:', error);
      throw error;
    }
  }

  static async getConnection() {
    try {
      return await oracledb.getConnection();
    } catch (error) {
      console.error('Error getting database connection:', error);
      throw error;
    }
  }

  static async closePool() {
    try {
      await oracledb.getPool().close();
      console.log('Database connection pool closed');
    } catch (error) {
      console.error('Error closing database connection pool:', error);
      throw error;
    }
  }
}

module.exports = DatabaseConfig;
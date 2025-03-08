/**
 * Environment Variables Configuration - Load and validate environment variables
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Required environment variables
const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_CONNECT_STRING'
];

// Validate required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

// Export environment variables with defaults
module.exports = {
  // Database configuration
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbConnectString: process.env.DB_CONNECT_STRING,
  
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // File paths
  suspectFilePath: process.env.SUSPECT_FILE_PATH || './files/suspect',
  bandrFilePath: process.env.BANDR_FILE_PATH || './files/bandr',
  fraudFilePath: process.env.FRAUD_FILE_PATH || './files/fraud',
  
  // Cron schedules
  suspectFileCron: process.env.SUSPECT_FILE_CRON || '*/5 * * * *', // Every 5 minutes
  bandrFileCron: process.env.BANDR_FILE_CRON || '0 */6 * * *',    // Every 6 hours
  fraudFileCron: process.env.FRAUD_FILE_CRON || '0 23 * * *'      // Once daily at 11 PM
};
// db.js
const mysql = require("mysql");
require("dotenv").config();

let db;
let isConnecting = false;

function handleDisconnect() {
  if (isConnecting) return;
  isConnecting = true;

  // Debug: Log environment variables
  console.log("🔍 Debug - Environment Variables:");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  // Debug: Check if variables are undefined
  console.log("🔍 Debug - Variable Check:");
  console.log("DB_HOST is undefined:", process.env.DB_HOST === undefined);
  console.log("DB_HOST is null:", process.env.DB_HOST === null);
  console.log("DB_HOST length:", process.env.DB_HOST ? process.env.DB_HOST.length : "undefined");

  const connectionConfig = {
    host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com', // Add fallback
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER || '4Vqx4ZUVAZtzDyk.root', // Add fallback
    password: process.env.DB_PASSWORD || 'aFb9wvjqeXt1C4m7', // Add fallback
    database: process.env.DB_NAME || 'test', // Add fallback,
    ssl: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  };

  console.log("🔍 Debug - Connection Config:", connectionConfig);
  console.log("🔍 Debug - Final Host:", connectionConfig.host);
  console.log("🔍 Debug - Final Port:", connectionConfig.port);

  db = mysql.createConnection(connectionConfig);

  db.connect((err) => {
    isConnecting = false;
    if (err) {
      console.log("❌ MySQL connection error:", err);
      setTimeout(handleDisconnect, 2000); // Try again after 2 seconds
    } else {
      console.log("✅ MySQL Connected");
    }
  });

  db.on('error', function(err) {
    console.log('⚠️  MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      console.log('⚠️  MySQL connection lost or fatal error. Reconnecting...');
      db.destroy(); // Force close the connection
      setTimeout(handleDisconnect, 2000); // Try again after 2 seconds
    } else {
      console.log('⚠️  Other MySQL error:', err);
    }
  });
}

handleDisconnect();

module.exports = db;

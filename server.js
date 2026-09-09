import "dotenv/config";
import sequelize from "./src/config/sequelize.js";
import "./src/database/models/associations.js"

if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_PORT || !process.env.PORT) {
  console.error("One or more required environment variables are not set");
  process.exit(1);
}

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

connectDb();
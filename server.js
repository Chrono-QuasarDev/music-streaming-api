import "dotenv/config";
import jwt from "jsonwebtoken";
import sequelize from "./src/config/sequelize.js";
import "./src/database/models/associations.js";
import app from "./src/app.js";

const requiredEnv = ["DATABASE_URL", "PORT", "JWT_SECRET", "JWT_EXPIRES"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

try {
  jwt.sign({}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
} catch (error) {
  console.error("Invalid JWT configuration:", error.message);
  process.exit(1);
}

async function connectDb() {
  try {
    await sequelize.authenticate();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

connectDb();
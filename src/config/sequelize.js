import "dotenv/config";
import { Sequelize } from "sequelize";

const connectionUri = process.env.DATABASE_URL;

if (!connectionUri) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sequelize = new Sequelize(connectionUri, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  },
});

export default sequelize;
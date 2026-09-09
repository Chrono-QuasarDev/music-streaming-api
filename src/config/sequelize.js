import { Sequelize } from "sequelize";

const connectionUri = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(connectionUri, {
  dialect: 'postgres',
  logging: false, 
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: false
  }
});

export default sequelize;
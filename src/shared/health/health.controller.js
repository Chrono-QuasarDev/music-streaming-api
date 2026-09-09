import sequelize from "../../config/sequelize.js";

export async function health(req, res) {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    checks: {
      database: 'UNKNOWN'
    }
  };

  try {
    await sequelize.authenticate();
    health.checks.database = 'UP';

    res.status(200).json(health);
  } catch (error) {
    health.status = 'DOWN';
    health.checks.database = 'DOWN';
    
    res.status(503).json(health);
  }
}
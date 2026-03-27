const db = require('../config/postgres');

// For the demo, we will only create one alert per sensor
// every 15 seconds to prevent spamming the alert feed.
const ALERT_COOLDOWN_SECONDS = 15; 

/**
 * Creates a new alert in the PostgreSQL database if one hasn't been created recently.
 * @param {object} alertData - { farmId, sensor, status, message }
 */
async function createAlert(alertData) {
  const { farmId, sensor, status, message } = alertData;

  try {
    // 1. Check if a recent alert for this sensor already exists
    const checkSql = `
      SELECT * FROM alerts
      WHERE farm_id = $1 AND sensor = $2
      AND created_at > (NOW() - INTERVAL '${ALERT_COOLDOWN_SECONDS} seconds')
    `;
    const recentAlerts = await db.query(checkSql, [farmId, sensor]);

    // 2. If no recent alert exists, create a new one
    if (recentAlerts.rows.length === 0) {
      const insertSql = `
        INSERT INTO alerts (farm_id, sensor, status, message)
        VALUES ($1, $2, $3, $4)
      `;
      await db.query(insertSql, [farmId, sensor, status, message]);
      console.log(`NEW ALERT CREATED: ${message}`);
    } else {
      console.log(`Alert for ${sensor} is in cooldown. Not creating a new one.`);
    }
  } catch (error) {
    console.error('Error creating alert:', error);
  }
}

/**
 * Fetches all alerts for a given farm.
 * @param {string} farmId
 */
async function getAlerts(farmId) {
  try {
    const sql = 'SELECT * FROM alerts WHERE farm_id = $1 ORDER BY created_at DESC LIMIT 50';
    const result = await db.query(sql, [farmId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

module.exports = {
  createAlert,
  getAlerts,
};
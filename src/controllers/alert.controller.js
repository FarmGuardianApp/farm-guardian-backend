const alertService = require('../services/alert.service');

async function getAlerts(req, res) {
  const { farmId } = req.params;
  try {
    const alerts = await alertService.getAlerts(farmId);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

module.exports = {
  getAlerts,
};
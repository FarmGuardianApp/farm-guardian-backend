// src/config/influx.js - Centralized InfluxDB connection.

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// This token MUST match the DOCKER_INFLUXDB_INIT_ADMIN_TOKEN in docker-compose.yml
const token = 'my-super-secret-token';
const org = 'FarmGuardian';
const bucket = 'sensor_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);

function writeSensorData(farmId, data) {
  const point = new Point('farm_sensors')
    .tag('farmId', farmId)
    .floatField('temperature', data.temperature)
    .floatField('humidity', data.humidity);
  
  writeApi.writePoint(point);
  writeApi.flush().catch(error => {
    // We add more detailed error logging here.
    console.error('Error writing to InfluxDB:', error.body || error.message);
  });
}

module.exports = { writeSensorData };
// src/config/influx.js - Centralized InfluxDB connection.

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

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
    console.error('Error writing to InfluxDB:', error);
  });
}

module.exports = { writeSensorData };

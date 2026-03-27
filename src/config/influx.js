// src/config/influx.js - Centralized InfluxDB connection.

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// --- No changes to your connection details ---
const token = 'my-super-secret-token';
const org = 'FarmGuardian';
const bucket = 'sensor_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);

// --- NEW ---
// We create a Read API to query (read) data from InfluxDB.
const readApi = client.getQueryApi(org);

// --- UPDATED ---
// This function now saves all 5 sensor fields.
function writeSensorData(farmId, data) {
  const point = new Point('farm_sensors')
    .tag('farmId', farmId)
    .floatField('temperature', data.temperature)
    .floatField('humidity', data.humidity)
    // --- ADDED THESE 3 LINES ---
    .floatField('pressure', data.pressure)
    .floatField('tds', data.tds)
    .floatField('ph', data.ph);
  
  writeApi.writePoint(point);
  
  // Flush the write. In a real app, this would be batched.
  writeApi.flush().catch(error => {
    console.error('Error writing to InfluxDB:', error.body || error.message);
  });
}

// --- NEW ---
// This is the brand new function that reads the latest data for the dashboard.
async function getLatestSensorData(farmId) {
  console.log(`Querying latest sensor data for farm ${farmId}`);
  
  // This is a Flux query, the language InfluxDB uses.
  // It's like SQL but for time-series data.
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -24h) // Look at data from the last 24 hours
      |> filter(fn: (r) => r["_measurement"] == "farm_sensors")
      |> filter(fn: (r) => r["farmId"] == "${farmId}")
      |> filter(fn: (r) => 
           r["_field"] == "temperature" or 
           r["_field"] == "humidity" or 
           r["_field"] == "pressure" or
           r["_field"] == "tds" or
           r["_field"] == "ph"
         )
      |> last() // Get the most recent point for each field
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value") // Format the data nicely
  `;

  // This part executes the query and packages the data into a simple object.
  return new Promise((resolve, reject) => {
    let latestData = {};
    readApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        // The query returns one row with all fields as columns.
        latestData = {
          time: o._time,
          temperature: o.temperature,
          humidity: o.humidity,
          pressure: o.pressure,
          tds: o.tds,
          ph: o.ph,
        };
      },
      error(error) {
        console.error('Error querying InfluxDB:', error);
        reject(error);
      },
      complete() {
        console.log('InfluxDB query complete.');
        // If no data is found, latestData will be an empty object.
        resolve(Object.keys(latestData).length > 0 ? latestData : null);
      },
    });
  });
}

// --- UPDATED EXPORTS ---
module.exports = { 
  writeSensorData,
  getLatestSensorData, // We must export the new function
};
// src/services/farm.service.js - Contains all database logic for farms.

// Make sure we are importing from the new config location
const db = require('../config/postgres');

// Service to get all farms from the database
async function getAllFarms() {
    const sql = 'SELECT * FROM farms ORDER BY created_at DESC';
    const result = await db.query(sql);
    return result.rows;
}

// Service to create a new farm in the database
async function createFarm(farmData) {
    const { name, location } = farmData;
    const sql = 'INSERT INTO farms (name, location) VALUES ($1, $2) RETURNING *';
    const values = [name, location];
    const result = await db.query(sql, values);
    return result.rows[0];
}

// Service to update a farm in the database
async function updateFarm(id, farmData) {
    const { name, location } = farmData;
    const sql = 'UPDATE farms SET name = $1, location = $2 WHERE id = $3 RETURNING *';
    const values = [name, location, id];
    const result = await db.query(sql, values);
    return result.rows[0]; // Returns the updated farm or undefined if not found
}

// Service to delete a farm from the database
async function deleteFarm(id) {
    const sql = 'DELETE FROM farms WHERE id = $1';
    const values = [id];
    const result = await db.query(sql, values);
    return result.rowCount > 0; // Returns true if a row was deleted, false otherwise
}

// This is the most likely source of the error.
// Ensure this block correctly exports all the functions.
module.exports = {
    getAllFarms,
    createFarm,
    updateFarm,
    deleteFarm,
};


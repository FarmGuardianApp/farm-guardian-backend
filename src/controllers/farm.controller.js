// src/controllers/farm.controller.js - Handles the request and response logic for farms.

const farmService = require('../services/farm.service');

// Controller to get all farms
async function getAllFarms(req, res) {
    try {
        const farms = await farmService.getAllFarms();
        res.json(farms);
    } catch (error) {
        console.error('Error fetching farms:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

// Controller to create a new farm
async function createFarm(req, res) {
    const { name, location } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Farm name is required.' });
    }
    try {
        const newFarm = await farmService.createFarm({ name, location });
        res.status(201).json(newFarm);
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

// Controller to update a farm
async function updateFarm(req, res) {
    const { id } = req.params;
    const { name, location } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Farm name is required.' });
    }
    try {
        const updatedFarm = await farmService.updateFarm(id, { name, location });
        if (!updatedFarm) {
            return res.status(404).json({ error: 'Farm not found.'});
        }
        res.json(updatedFarm);
    } catch (error) {
        console.error(`Error updating farm with ID ${id}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

// Controller to delete a farm
async function deleteFarm(req, res) {
    const { id } = req.params;
    try {
        const success = await farmService.deleteFarm(id);
        if (!success) {
            return res.status(404).json({ error: 'Farm not found.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting farm with ID ${id}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

module.exports = {
    getAllFarms,
    createFarm,
    updateFarm,
    deleteFarm,
};

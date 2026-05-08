const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles = await db.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { license_plate, brand, model, year, owner_name, owner_phone } = req.body;
  try {
    const vehicle = await db.vehicle.create({
      data: {
        license_plate,
        brand,
        model,
        year: year ? parseInt(year, 10) : null,
        owner_name,
        owner_phone,
      },
    });
    res.status(201).json({ id: vehicle.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  try {
    const history = await db.workorder.findMany({
      where: { vehicle_id: parseInt(id, 10) },
      orderBy: { created_at: 'desc' },
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

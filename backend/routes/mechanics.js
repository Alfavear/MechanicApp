const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mechanics = await db.mechanic.findMany();
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, specialty, phone } = req.body;
  try {
    const mechanic = await db.mechanic.create({
      data: { name, specialty, phone },
    });
    res.status(201).json({ id: mechanic.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

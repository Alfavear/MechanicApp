const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const services = await db.serviceCatalog.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  const { name, description, suggested_price } = req.body;
  try {
    const service = await db.serviceCatalog.create({
      data: {
        name,
        description,
        suggested_price: parseFloat(suggested_price)
      }
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  const { name, description, suggested_price } = req.body;
  try {
    const service = await db.serviceCatalog.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description,
        suggested_price: parseFloat(suggested_price)
      }
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

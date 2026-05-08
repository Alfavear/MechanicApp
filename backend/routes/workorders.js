const express = require('express');
const db = require('../db');
const router = express.Router();

const validStatuses = ['Pendiente', 'En revision', 'En prueba de Ruta', 'Pendiente por entregar', 'Entregado'];

router.get('/', async (req, res) => {
  try {
    const workorders = await db.workorder.findMany();
    res.json(workorders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { vehicle_id, mechanic_id, status, description, estimated_delivery } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    const workorder = await db.workorder.create({
      data: {
        vehicle_id: parseInt(vehicle_id, 10),
        mechanic_id: parseInt(mechanic_id, 10),
        status,
        description,
        estimated_delivery: estimated_delivery ? new Date(estimated_delivery) : null,
      },
    });
    res.status(201).json({ id: workorder.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    await db.workorder.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });
    res.json({ updated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/parts', async (req, res) => {
  const { id } = req.params;
  const { item_id, quantity } = req.body;
  try {
    const part = await db.workorderPart.create({
      data: {
        workorder_id: parseInt(id, 10),
        item_id: parseInt(item_id, 10),
        quantity: parseInt(quantity, 10),
      },
    });
    res.status(201).json({ id: part.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const workorder = await db.workorder.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!workorder) return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    res.json(workorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

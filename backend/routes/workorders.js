const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

const validStatuses = ['Pendiente', 'En revision', 'En prueba de Ruta', 'Pendiente por entregar', 'Entregado', 'Suspendido por repuestos'];

// Helper to determine mechanic status based on workorder status
const getMechanicStatus = (status) => {
  if (['Pendiente', 'En revision', 'En prueba de Ruta'].includes(status)) return 'Ocupado';
  return 'Disponible';
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const workorders = await db.workorder.findMany();
    res.json(workorders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  const { vehicle_id, mechanic_id, status, description, estimated_delivery, customer_provided_parts, entry_observations } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    const workorder = await db.$transaction(async (tx) => {
      const wo = await tx.workorder.create({
        data: {
          vehicle_id: parseInt(vehicle_id, 10),
          mechanic_id: parseInt(mechanic_id, 10),
          status,
          description,
          entry_observations,
          customer_provided_parts: customer_provided_parts === true,
          estimated_delivery: estimated_delivery ? new Date(estimated_delivery) : null,
        },
      });
      await tx.mechanic.update({
        where: { id: parseInt(mechanic_id, 10) },
        data: { status: getMechanicStatus(status) }
      });
      return wo;
    });
    res.status(201).json({ id: workorder.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', authenticateToken, authorizeRole(['ADMIN', 'MECHANIC']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    await db.$transaction(async (tx) => {
      const wo = await tx.workorder.update({
        where: { id: parseInt(id, 10) },
        data: { status },
      });
      await tx.mechanic.update({
        where: { id: wo.mechanic_id },
        data: { status: getMechanicStatus(status) }
      });
    });
    res.json({ updated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/parts', authenticateToken, authorizeRole(['ADMIN', 'MECHANIC']), async (req, res) => {
  const { id } = req.params;
  const { item_id, quantity } = req.body;
  try {
    const part = await db.$transaction(async (tx) => {
      // Create the part link
      const newPart = await tx.workorderPart.create({
        data: {
          workorder_id: parseInt(id, 10),
          item_id: parseInt(item_id, 10),
          quantity: parseInt(quantity, 10),
        },
      });
      // Deduct from inventory
      await tx.inventoryItem.update({
        where: { id: parseInt(item_id, 10) },
        data: { quantity: { decrement: parseInt(quantity, 10) } }
      });
      return newPart;
    });
    res.status(201).json({ id: part.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/services', authenticateToken, authorizeRole(['ADMIN', 'MECHANIC']), async (req, res) => {
  const { id } = req.params;
  const { service_id, price } = req.body;
  try {
    const service = await db.workorderService.create({
      data: {
        workorder_id: parseInt(id, 10),
        service_id: parseInt(service_id, 10),
        price: parseFloat(price)
      }
    });
    res.status(201).json({ id: service.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/photos', authenticateToken, authorizeRole(['ADMIN', 'MECHANIC']), async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  try {
    const photo = await db.workorderPhoto.create({
      data: {
        workorder_id: parseInt(id, 10),
        url
      }
    });
    res.status(201).json({ id: photo.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const workorder = await db.workorder.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        vehicle: true,
        mechanic: true,
        parts: { include: { item: true } },
        services: { include: { service: true } },
        photos: true
      }
    });
    if (!workorder) return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    res.json(workorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

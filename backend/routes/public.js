const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/public/workorders
// Returns active workorders (not "Entregado") for the public screen.
// Masks the license plate for privacy.
router.get('/workorders', async (req, res) => {
  try {
    const workorders = await db.workorder.findMany({
      where: {
        status: { not: 'Entregado' }
      },
      include: {
        vehicle: true,
        mechanic: true
      },
      orderBy: { updated_at: 'desc' }
    });

    const publicData = workorders.map(wo => {
      // Mask license plate (e.g., ABC-123 -> ABC-***)
      const plate = wo.vehicle.license_plate;
      let maskedPlate = plate;
      if (plate.length >= 6) {
        maskedPlate = plate.substring(0, 3) + '***' + plate.substring(plate.length - 1);
      } else {
        maskedPlate = '***';
      }

      return {
        id: wo.id,
        license_plate: maskedPlate,
        status: wo.status,
        mechanic_name: wo.mechanic.name,
        updated_at: wo.updated_at
      };
    });

    res.json(publicData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

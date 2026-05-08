const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const items = await db.inventoryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/items', async (req, res) => {
  const { name, sku, quantity, cost_price, sale_price } = req.body;
  try {
    const item = await db.inventoryItem.create({
      data: {
        name,
        sku,
        quantity: quantity ? parseInt(quantity, 10) : 0,
        cost_price: cost_price ? parseFloat(cost_price) : null,
        sale_price: sale_price ? parseFloat(sale_price) : null,
      },
    });
    res.status(201).json({ id: item.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/purchases', async (req, res) => {
  const { item_id, quantity, total_cost, supplier } = req.body;
  try {
    const purchase = await db.$transaction([
      db.inventoryPurchase.create({
        data: {
          item_id: parseInt(item_id, 10),
          quantity: parseInt(quantity, 10),
          total_cost: total_cost ? parseFloat(total_cost) : null,
          supplier,
        },
      }),
      db.inventoryItem.update({
        where: { id: parseInt(item_id, 10) },
        data: { quantity: { increment: parseInt(quantity, 10) } },
      }),
    ]);
    res.status(201).json({ id: purchase[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sales', async (req, res) => {
  const { item_id, quantity, total_price, customer } = req.body;
  try {
    const sale = await db.$transaction([
      db.inventorySale.create({
        data: {
          item_id: parseInt(item_id, 10),
          quantity: parseInt(quantity, 10),
          total_price: total_price ? parseFloat(total_price) : null,
          customer,
        },
      }),
      db.inventoryItem.update({
        where: { id: parseInt(item_id, 10) },
        data: { quantity: { decrement: parseInt(quantity, 10) } },
      }),
    ]);
    res.status(201).json({ id: sale[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const invoices = await db.invoice.findMany();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { workorder_id, invoice_number, amount, tax, status, date } = req.body;
  try {
    const invoice = await db.invoice.create({
      data: {
        workorder_id: parseInt(workorder_id, 10),
        invoice_number,
        amount: parseFloat(amount),
        tax: tax ? parseFloat(tax) : null,
        status,
        date: date ? new Date(date) : undefined,
      },
    });
    res.status(201).json({ id: invoice.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

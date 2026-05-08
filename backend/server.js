const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const vehiclesRoutes = require('./routes/vehicles');
const mechanicsRoutes = require('./routes/mechanics');
const workordersRoutes = require('./routes/workorders');
const inventoryRoutes = require('./routes/inventory');
const invoicesRoutes = require('./routes/invoices');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Taller Mecánico en funcionamiento' });
});

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/mechanics', mechanicsRoutes);
app.use('/api/workorders', workordersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/services', require('./routes/services'));

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

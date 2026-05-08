import { NavLink, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Mechanics from './components/Mechanics';
import Workorders from './components/Workorders';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Taller Mecánico</h1>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/vehicles">Vehículos</NavLink>
          <NavLink to="/mechanics">Mecánicos</NavLink>
          <NavLink to="/workorders">Órdenes</NavLink>
          <NavLink to="/inventory">Inventario</NavLink>
          <NavLink to="/invoices">Facturación</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/workorders" element={<Workorders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

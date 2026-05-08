import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Mechanics from './components/Mechanics';
import Workorders from './components/Workorders';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import AppLayout from './components/AppLayout';
import ServicesCatalog from './components/ServicesCatalog';
import PublicBoard from './components/PublicBoard';
import ConsentDocument from './components/ConsentDocument';
import SatisfactionDocument from './components/SatisfactionDocument';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/board" element={<PublicBoard />} />
      <Route path="/consent" element={<ConsentDocument />} />
      <Route path="/satisfaction" element={<SatisfactionDocument />} />
      <Route path="/*" element={
        <AppLayout title="MechanicApp">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/workorders" element={<Workorders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/services" element={<ServicesCatalog />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </AppLayout>
      } />
    </Routes>
  );
}

export default App;

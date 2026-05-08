import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({ name: '', sku: '', quantity: '', cost_price: '', sale_price: '' });
  const [purchaseForm, setPurchaseForm] = useState({ item_id: '', quantity: '', total_cost: '', supplier: '' });
  const [saleForm, setSaleForm] = useState({ item_id: '', quantity: '', total_price: '', customer: '' });

  useEffect(() => {
    fetchJson('/inventory/items').then(setItems).catch(console.error);
  }, []);

  const refresh = async () => setItems(await fetchJson('/inventory/items'));

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    await fetchJson('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(itemForm),
    });
    await refresh();
    setItemForm({ name: '', sku: '', quantity: '', cost_price: '', sale_price: '' });
  };

  const handlePurchaseSubmit = async (event) => {
    event.preventDefault();
    await fetchJson('/inventory/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseForm),
    });
    await refresh();
    setPurchaseForm({ item_id: '', quantity: '', total_cost: '', supplier: '' });
  };

  const handleSaleSubmit = async (event) => {
    event.preventDefault();
    await fetchJson('/inventory/sales', {
      method: 'POST',
      body: JSON.stringify(saleForm),
    });
    await refresh();
    setSaleForm({ item_id: '', quantity: '', total_price: '', customer: '' });
  };

  return (
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Inventario</h2>
          <p>Productos, compras y ventas del taller.</p>
        </div>
      </div>

      <div className="panel">
        <h3>Nuevo producto</h3>
        <form onSubmit={handleItemSubmit} className="form-grid">
          <div>
            <label>Nombre</label>
            <input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
          </div>
          <div>
            <label>SKU</label>
            <input value={itemForm.sku} onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })} />
          </div>
          <div>
            <label>Cantidad</label>
            <input type="number" value={itemForm.quantity} onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} />
          </div>
          <div>
            <label>Costo</label>
            <input type="number" value={itemForm.cost_price} onChange={(e) => setItemForm({ ...itemForm, cost_price: e.target.value })} />
          </div>
          <div>
            <label>Precio venta</label>
            <input type="number" value={itemForm.sale_price} onChange={(e) => setItemForm({ ...itemForm, sale_price: e.target.value })} />
          </div>
          <div>
            <button type="submit">Agregar producto</button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Compra de inventario</h3>
        <form onSubmit={handlePurchaseSubmit} className="form-grid">
          <div>
            <label>Producto</label>
            <select value={purchaseForm.item_id} onChange={(e) => setPurchaseForm({ ...purchaseForm, item_id: e.target.value })} required>
              <option value="">Selecciona</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Cantidad</label>
            <input type="number" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })} />
          </div>
          <div>
            <label>Costo total</label>
            <input type="number" value={purchaseForm.total_cost} onChange={(e) => setPurchaseForm({ ...purchaseForm, total_cost: e.target.value })} />
          </div>
          <div>
            <label>Proveedor</label>
            <input value={purchaseForm.supplier} onChange={(e) => setPurchaseForm({ ...purchaseForm, supplier: e.target.value })} />
          </div>
          <div>
            <button type="submit">Registrar compra</button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Venta de inventario</h3>
        <form onSubmit={handleSaleSubmit} className="form-grid">
          <div>
            <label>Producto</label>
            <select value={saleForm.item_id} onChange={(e) => setSaleForm({ ...saleForm, item_id: e.target.value })} required>
              <option value="">Selecciona</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Cantidad</label>
            <input type="number" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
          </div>
          <div>
            <label>Precio total</label>
            <input type="number" value={saleForm.total_price} onChange={(e) => setSaleForm({ ...saleForm, total_price: e.target.value })} />
          </div>
          <div>
            <label>Cliente</label>
            <input value={saleForm.customer} onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })} />
          </div>
          <div>
            <button type="submit">Registrar venta</button>
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Cantidad</th>
            <th>Costo</th>
            <th>Precio venta</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.quantity}</td>
              <td>{item.cost_price}</td>
              <td>{item.sale_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;

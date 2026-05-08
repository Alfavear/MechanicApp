import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { Package, Plus, ShoppingCart, Tag, Database } from 'lucide-react';

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

  const FormSection = ({ title, icon: Icon, onSubmit, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
        <Icon className="w-4 h-4 text-indigo-500" /> {title}
      </h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </form>
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, required = false }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        required={required}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Control de Inventario</h2>
          <p className="text-sm text-gray-500 mt-1">Gestión de repuestos, entradas y salidas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <FormSection title="Nuevo Producto" icon={Plus} onSubmit={handleItemSubmit}>
            <InputField label="Nombre" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
            <InputField label="SKU / Código" value={itemForm.sku} onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })} />
            <InputField label="Stock Inicial" type="number" value={itemForm.quantity} onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} />
            <div className="flex items-end">
               <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Añadir</button>
            </div>
          </FormSection>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold text-gray-900 uppercase">Stock Actual</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Producto</th>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">SKU</th>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-center">Cantidad</th>
                      <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-right">Precios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-gray-900">{item.name}</td>
                        <td className="px-6 py-3 text-gray-500 font-mono text-xs">{item.sku || '---'}</td>
                        <td className="px-6 py-3 text-center">
                           <span className={clsx(
                             "px-2 py-1 rounded font-bold text-xs",
                             item.quantity > 5 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                           )}>
                             {item.quantity}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400">Venta: ${item.sale_price}</span>
                              <span className="text-[10px] text-gray-400">Costo: ${item.cost_price}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <FormSection title="Entrada (Compra)" icon={ShoppingCart} onSubmit={handlePurchaseSubmit}>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Producto</label>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={purchaseForm.item_id} onChange={(e) => setPurchaseForm({ ...purchaseForm, item_id: e.target.value })} required>
                  <option value="">Selecciona</option>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <InputField label="Cantidad" type="number" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })} />
              <InputField label="Costo Total" type="number" value={purchaseForm.total_cost} onChange={(e) => setPurchaseForm({ ...purchaseForm, total_cost: e.target.value })} />
              <div className="col-span-4 flex justify-end">
                <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-emerald-700 transition-colors">Registrar Entrada</button>
              </div>
           </FormSection>

           <FormSection title="Salida (Venta)" icon={Tag} onSubmit={handleSaleSubmit}>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Producto</label>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={saleForm.item_id} onChange={(e) => setSaleForm({ ...saleForm, item_id: e.target.value })} required>
                  <option value="">Selecciona</option>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <InputField label="Cantidad" type="number" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
              <InputField label="Precio Total" type="number" value={saleForm.total_price} onChange={(e) => setSaleForm({ ...saleForm, total_price: e.target.value })} />
              <div className="col-span-4 flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-indigo-700 transition-colors">Registrar Salida</button>
              </div>
           </FormSection>
        </div>
      </div>
    </div>
  );
}

export default Inventory;

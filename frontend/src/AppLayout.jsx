import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AppLayout({ children, title = "Panel de Control" }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top Navbar - Navegación Superior */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo y Nombre */}
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-2 rounded-lg font-black text-xl leading-none shadow-md shadow-red-200">
                M
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Mechanic<span className="text-red-600">App</span>
              </h1>
            </div>

            {/* Menú de Navegación Horizontal */}
            <nav className="hidden md:flex space-x-2">
              <NavLink to="/" end className={({isActive}) => `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                Dashboard
              </NavLink>
              <NavLink to="/workorders" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                Órdenes
              </NavLink>
              <NavLink to="/vehicles" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                Vehículos
              </NavLink>
              <NavLink to="/mechanics" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                Mecánicos
              </NavLink>
              <NavLink to="/inventory" className={({isActive}) => `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                Inventario
              </NavLink>
            </nav>

            {/* Avatar del usuario (Ej: Mecánico o Admin) */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-none">Admin</p>
                <p className="text-xs text-slate-500">Taller Central</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Área Principal de Contenido - Centrada y enmarcada */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">Gestión integral del taller mecánico</p>
          </div>
        </div>

        {/* Contenedor blanco con sombra suave tipo SaaS */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 p-6">
          {children}
        </div>
        
      </main>
    </div>
  );
}
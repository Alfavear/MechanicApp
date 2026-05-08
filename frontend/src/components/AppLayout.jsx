import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Car, 
  Users, 
  Package, 
  FileText, 
  Search, 
  Bell, 
  Settings, 
  ChevronRight,
  Menu,
  ChevronDown,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/workorders', icon: Wrench, label: 'Órdenes' },
  { path: '/vehicles', icon: Car, label: 'Vehículos' },
  { path: '/mechanics', icon: Users, label: 'Mecánicos' },
  { path: '/inventory', icon: Package, label: 'Inventario' },
  { path: '/services', icon: Activity, label: 'Servicios' },
  { path: '/invoices', icon: FileText, label: 'Facturación' },
];

export default function AppLayout({ children, title = "Panel de Control" }) {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#EEF2F6]">
      
      {/* Header - Premium Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#1e40af] via-[#3b82f6] to-[#0ea5e9] text-white flex items-center justify-between px-6 z-50 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 w-48">
             <Wrench className="w-7 h-7 text-white" />
             <span className="text-xl font-bold tracking-wide">MechanicApp</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 pr-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 transition-all"
            />
          </div>
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/20 cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-8 h-8 rounded-full bg-white/20 border border-white/30" />
             <div className="hidden md:block text-right">
                <p className="text-sm font-bold leading-tight">Admin User</p>
                <p className="text-[10px] text-blue-200">Taller Central</p>
             </div>
             <ChevronDown className="w-4 h-4 text-blue-200" />
          </div>
        </div>
      </header>

      {/* Sidebar - Light/White theme */}
      <aside className={cn(
        "fixed inset-y-0 left-0 pt-16 bg-white border-r border-gray-200 z-40 transition-all duration-300 shadow-sm flex flex-col",
        isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menú Principal</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-700 font-bold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen pt-16 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        
        {/* Dynamic Sub-header / Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-30">
          <div className="flex flex-col">
            <div className="flex items-center text-xs font-medium text-gray-400 mb-1">
              <span>Home</span>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span>{title}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>

      </main>
    </div>
  );
}
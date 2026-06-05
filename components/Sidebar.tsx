
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const links = [
    { to: '/', icon: 'fa-chart-line', label: 'Dashboard' },
    { to: '/inventory', icon: 'fa-warehouse', label: 'Inventory' },
    { to: '/usage', icon: 'fa-hand-holding-medical', label: 'Blood Withdrawal' },
    { to: '/donors', icon: 'fa-users', label: 'Donor Database' },
    { to: '/sister-hospitals', icon: 'fa-hospital', label: 'Sister Hospitals' },
    ...(role === UserRole.ADMIN ? [{ to: '/register-donor', icon: 'fa-user-plus', label: 'Register Donor' }] : []),
    { to: '/outreach', icon: 'fa-bullhorn', label: 'Donor Outreach' },
    { to: '/reports', icon: 'fa-file-alt', label: 'Reports' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <i className="fa-solid fa-droplet text-red-500 text-2xl"></i>
          <span>HemaMatch</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-red-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className={`fa-solid ${link.icon} w-6 text-center`}></i>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <i className="fa-solid fa-right-from-bracket w-6 text-center"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

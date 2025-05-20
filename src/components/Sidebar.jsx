import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const handleClick = () => {
    if (window.innerWidth < 768 && typeof onClose === 'function') {
      onClose();
    }
  };

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition font-medium ${
      isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-10 text-blue-600">Backoffice</h1>
      <nav className="flex flex-col gap-2 text-sm">
        <NavLink to="/dashboard" className={linkClasses} onClick={handleClick}>Dashboard</NavLink>
        <NavLink to="/categories" className={linkClasses} onClick={handleClick}>Kategoriler</NavLink>
        <NavLink to="/products" className={linkClasses} onClick={handleClick}>Ürünler</NavLink>
        <NavLink to="/orders" className={linkClasses} onClick={handleClick}>Siparişler</NavLink>
        <NavLink to="/variant-options" className={linkClasses} onClick={handleClick}>Varyant Seçenekleri</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

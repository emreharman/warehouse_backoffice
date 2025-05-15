import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // modern ikon

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm w-full">
      <div className="flex items-center gap-4">
        {/* Şık hamburger ikonu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition md:hidden">
          <Menu size={20} strokeWidth={2} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h2>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm px-3 py-1 bg-red-50 rounded hover:bg-red-100 text-red-600 font-medium">
        Çıkış Yap
      </button>
    </header>
  );
};

export default Navbar;

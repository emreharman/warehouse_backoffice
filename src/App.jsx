import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Sayfa bileşenleri
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import VariantOptions from "./pages/VariantOptions"; // ✅ yeni sayfa import

const Dashboard = () => (
  <div className="bg-white border rounded-lg p-6 shadow-sm">
    <h1 className="text-2xl font-bold mb-2 text-gray-800">Hoş Geldin 👋</h1>
    <p className="text-gray-600">Siparişleri ve içerikleri buradan yönetebilirsin.</p>
  </div>
);
const Orders = () => <h2>Siparişler Sayfası</h2>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Korunan rotalar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Categories />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/variant-options"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VariantOptions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

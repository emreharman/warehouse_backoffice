import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrders,
  removeOrder,
  updateOrderStatusById,
} from "../redux/actions/orderActions";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: orders, loading, error } = useSelector((state) => state.orders);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const confirmDelete = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      await dispatch(removeOrder(selectedOrder._id));
      setDeleteModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setEditModalOpen(true);
  };

  const handleStatusSave = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      await dispatch(updateOrderStatusById(selectedOrder._id, newStatus));
    }
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Siparişler</h1>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600">Hata: {error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">Henüz sipariş bulunmuyor.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Müşteri</th>
                <th className="px-4 py-2">Tarih</th>
                <th className="px-4 py-2">Durum</th>
                <th className="px-4 py-2">Toplam</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{order.customer?.name || "-"}</td>
                  <td className="px-4 py-2 text-gray-700">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-2 text-gray-700 capitalize">{order.status.replace("_", " ")}</td>
                  <td className="px-4 py-2 text-gray-700">{order.totalPrice} ₺</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        Detaylar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={() => openEditModal(order)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => confirmDelete(order)}
                      >
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Silme Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Siparişi Sil"
      >
        <p className="text-gray-700 mb-4">
          #{selectedOrder?._id} numaralı siparişi silmek istediğinize emin misiniz?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setDeleteModalOpen(false)}
          >
            Vazgeç
          </Button>
          <Button
            variant="danger"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            Sil
          </Button>
        </div>
      </Modal>

      {/* Durum Güncelleme Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Sipariş Durumu Güncelle"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600 font-medium">
              Yeni Durum
            </label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {["pre_payment", "pending", "in_progress", "shipped", "delivered", "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setEditModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleStatusSave}
            >
              Güncelle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;

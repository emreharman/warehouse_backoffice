import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVariantOptions,
  addVariantOption,
  removeVariantOption,
} from "../redux/actions/variantOptionActions";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const VariantOptions = () => {
  const dispatch = useDispatch();
  const { data: variantOptions, loading, error } = useSelector(
    (state) => state.variantOptions
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
  });

  useEffect(() => {
    dispatch(getVariantOptions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.type) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    await dispatch(addVariantOption(formData));
    setFormData({ type: "", name: "" });
    setModalOpen(false);
  };

  const confirmDelete = (option) => {
    setSelectedOption(option);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedOption) {
      await dispatch(removeVariantOption(selectedOption._id));
      setDeleteModalOpen(false);
      setSelectedOption(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Varyant Seçenekleri</h1>
        <Button onClick={() => setModalOpen(true)}>+ Yeni Seçenek</Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-600">Hata: {error}</p>}
      {!loading && !error && variantOptions.length === 0 && (
        <p className="text-gray-600">Henüz varyant eklenmemiş.</p>
      )}

      {!loading && !error && variantOptions.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Tip</th>
                <th className="px-4 py-2">Ad</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {variantOptions.map((option, index) => (
                <tr key={option._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700 capitalize">{option.type}</td>
                  <td className="px-4 py-2 text-gray-700">{option.name}</td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(option)}>
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData({ type: "", name: "" });
        }}
        title="Yeni Varyant Seçeneği">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2">
              <option value="">Seçiniz</option>
              <option value="color">Renk</option>
              <option value="size">Beden</option>
              <option value="quality">Kalite</option>
              <option value="fit">Kesim</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Örn: Mavi"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreate}>Ekle</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Varyant Seçeneğini Sil">
        <p className="text-gray-700 mb-4">
          <strong>{selectedOption?.name}</strong> seçeneğini silmek istediğinize emin misiniz?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default VariantOptions;

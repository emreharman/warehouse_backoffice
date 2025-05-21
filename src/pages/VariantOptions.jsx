import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVariantOptions,
  addVariantOption,
  editVariantOption,
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
  const [updateMode, setUpdateMode] = useState(false);

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

  const handleSubmit = async () => {
    const name = formData.name.trim();
    const type = formData.type;

    if (!name || !type) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const alreadyExists = variantOptions.some(
      (opt) =>
        opt.name.trim().toLowerCase() === name.toLowerCase() &&
        opt.type === type &&
        opt._id !== (selectedOption?._id || "")
    );

    if (alreadyExists) {
      alert("Bu isimde bir varyant zaten var.");
      return;
    }

    if (updateMode && selectedOption) {
      await dispatch(editVariantOption(selectedOption._id, { name, type }));
    } else {
      await dispatch(addVariantOption({ name, type }));
    }

    setFormData({ type: "", name: "" });
    setModalOpen(false);
    setUpdateMode(false);
    setSelectedOption(null);
  };

  const handleEdit = (option) => {
    setFormData({
      name: option.name,
      type: option.type,
    });
    setSelectedOption(option);
    setUpdateMode(true);
    setModalOpen(true);
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
        <h1 className="text-xl font-semibold text-gray-800">
          Varyant Seçenekleri
        </h1>
        <Button
          onClick={() => {
            setModalOpen(true);
            setUpdateMode(false);
            setFormData({ name: "", type: "" });
            setSelectedOption(null);
          }}
        >
          + Yeni Seçenek
        </Button>
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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {variantOptions.map((option, index) => (
                <tr key={option._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-600 capitalize">{option.type}</td>
                  <td className="px-4 py-2 text-gray-600">{option.name}</td>
                  <td className="px-4 py-2 text-gray-500">{option._id}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button variant="soft" size="sm" onClick={() => handleEdit(option)}>
                      Düzenle
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => confirmDelete(option)}>
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Oluştur / Güncelle */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUpdateMode(false);
          setSelectedOption(null);
          setFormData({ name: "", type: "" });
        }}
        title={updateMode ? "Seçeneği Güncelle" : "Yeni Seçenek Ekle"}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Seçiniz</option>
              <option value="color">Renk</option>
              <option value="size">Beden</option>
              <option value="quality">Kalite</option>
              <option value="fit">Kesim</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad
            </label>
            <input
              type="text"
              name="name"
              placeholder="Örn: Mavi"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              {updateMode ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Silme Onayı */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Varyant Seçeneğini Sil"
      >
        <p className="text-gray-700 mb-4">
          <strong>{selectedOption?.name}</strong> adlı seçeneği silmek istediğinize emin misiniz?
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

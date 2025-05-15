import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../redux/actions/categoryActions";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const Categories = () => {
  const dispatch = useDispatch();

  const { data: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) return;

    const alreadyExists = categories.some(
      (cat) =>
        cat.name.trim().toLowerCase() === name.toLowerCase() &&
        cat._id !== (selectedCategory?._id || "")
    );

    if (alreadyExists) {
      alert("Bu isimde bir kategori zaten var.");
      return;
    }

    if (updateMode && selectedCategory) {
      await dispatch(editCategory(selectedCategory._id, { name, description }));
    } else {
      await dispatch(addCategory({ name, description }));
    }

    setFormData({ name: "", description: "" });
    setModalOpen(false);
    setUpdateMode(false);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setSelectedCategory(category);
    setUpdateMode(true);
    setModalOpen(true);
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      await dispatch(removeCategory(selectedCategory._id));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Kategoriler</h1>
        <Button
          onClick={() => {
            setModalOpen(true);
            setUpdateMode(false);
            setFormData({ name: "", description: "" });
            setSelectedCategory(null);
          }}
        >
          + Yeni Kategori
        </Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-600">Hata: {error}</p>}
      {!loading && !error && categories.length === 0 && (
        <p className="text-gray-600">Henüz kategori eklenmemiş.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Ad</th>
                <th className="px-4 py-2">Açıklama</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-600">{category.name}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {category.description || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{category._id}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button variant="soft" size="sm" onClick={() => handleEdit(category)}>
                      Düzenle
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(category)}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --------------------------- */}
      {/* Modal: Oluştur / Güncelle */}
      {/* --------------------------- */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUpdateMode(false);
          setSelectedCategory(null);
          setFormData({ name: "", description: "" });
        }}
        title={updateMode ? "Kategoriyi Güncelle" : "Yeni Kategori Oluştur"}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori Adı
            </label>
            <input
              type="text"
              name="name"
              placeholder="Elektronik"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              placeholder="Kategori hakkında açıklama"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              {updateMode ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ------------------------ */}
      {/* Modal: Silme Onayı */}
      {/* ------------------------ */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Kategoriyi Sil"
      >
        <p className="text-gray-700 mb-4">
          <strong>{selectedCategory?.name}</strong> adlı kategoriyi silmek
          istediğinize emin misiniz?
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

export default Categories;

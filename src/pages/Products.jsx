import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  addProduct,
  removeProduct,
} from "../redux/actions/productActions";
import { getCategories } from "../redux/actions/categoryActions";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const Products = () => {
  const dispatch = useDispatch();

  const {
    data: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { data: categories } = useSelector((state) => state.categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    const { name, category, price, stock } = formData;

    if (!name.trim() || !category || !price || !stock) return;

    const payload = {
      name: name.trim(),
      category,
      variants: [
        {
          price: parseFloat(price),
          stock: parseInt(stock),
        },
      ],
    };

    await dispatch(addProduct(payload));
    setFormData({ name: "", category: "", price: "", stock: "" });
    setModalOpen(false);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await dispatch(removeProduct(selectedProduct._id));
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Ürünler</h1>
        <Button onClick={() => setModalOpen(true)}>+ Yeni Ürün</Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-600">Hata: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-gray-600">Henüz ürün eklenmemiş.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Ürün Adı</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Fiyat</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category?.name || "-"}</td>
                  <td className="px-4 py-2">
                    {product.variants?.[0]?.price ?? "-"} ₺
                  </td>
                  <td className="px-4 py-2">
                    {product.variants?.[0]?.stock ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(product)}
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

      {/* ----------- Ürün Oluştur Modal ----------- */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData({ name: "", category: "", price: "", stock: "" });
        }}
        title="Yeni Ürün Ekle"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı
            </label>
            <input
              type="text"
              name="name"
              placeholder="Örn: Basic T-shirt"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Seçiniz</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (₺)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreate}>Ekle</Button>
          </div>
        </div>
      </Modal>

      {/* ----------- Silme Onayı Modal ----------- */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Ürünü Sil"
      >
        <p className="text-gray-700 mb-4">
          <strong>{selectedProduct?.name}</strong> adlı ürünü silmek
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

export default Products;

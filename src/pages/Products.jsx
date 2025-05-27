import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  addProduct,
  removeProduct,
  updateProductById,
} from "../redux/actions/productActions";
import { getCategories } from "../redux/actions/categoryActions";
import { uploadProductImage } from "../utils/uploadImage";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const initialFormData = {
  name: "",
  category: "",
  price: "",
  stock: "",
  images: [],
  description: "",
  tags: "",
};

const MAX_IMAGE_COUNT = 5;

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
  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGE_COUNT - formData.images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setUploading(true);
    try {
      const urls = await Promise.all(filesToUpload.map(uploadProductImage));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      alert("Resim yüklenirken hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || "",
      price: product.variants?.[0]?.price || "",
      stock: product.variants?.[0]?.stock || "",
      images: product.images || [],
      description: product.description || "",
      tags: product.tags?.join(", ") || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { name, category, price, stock, images, description, tags } =
      formData;

    if (!name.trim() || !category || !price || !stock) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      variants: [{ price: parseFloat(price), stock: parseInt(stock) }],
      images,
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (selectedProduct) {
      await dispatch(updateProductById(selectedProduct._id, payload));
    } else {
      await dispatch(addProduct(payload));
    }

    setModalOpen(false);
    resetForm();
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
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Yeni Ürün
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-600">Hata: {error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">Henüz ürün eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          {/* tablo kısmı burada olacak */}
        </div>
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
                <th className="px-4 py-2">Resimler</th>
                <th className="px-4 py-2 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{product.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.category?.name || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.variants?.[0]?.price ?? "-"} ₺
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.variants?.[0]?.stock ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {product.images?.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${product.name} ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ))}
                      {!product.images?.length && "-"}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(product)}
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

      {/* ----------- Ürün Oluştur Modal ----------- */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      >
        <div className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Ürün Adı <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Örn: Basic T-shirt"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="category"
            >
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
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
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="price"
              >
                Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="stock"
              >
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="images"
            >
              Ürün Resimleri
            </label>
            <input
              id="images"
              type="file"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={handleFilesChange}
              disabled={uploading}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <p className="text-sm text-gray-500 mt-1">
              Birden fazla görsel seçebilirsiniz. Maksimum {MAX_IMAGE_COUNT}{" "}
              adet.
            </p>
            {uploading && (
              <p className="text-sm text-blue-600 mt-1">Yükleniyor...</p>
            )}
            {formData.images.length > 0 && !uploading && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Ürün resmi ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs hidden group-hover:block"
                      title="Kaldır"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="description"
            >
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="tags"
            >
              Etiketler (virgülle ayır)
            </label>
            <input
              id="tags"
              type="text"
              name="tags"
              placeholder="örneğin: erkek, yaz, spor"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {selectedProduct ? "Güncelle" : "Ekle"}
            </Button>
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

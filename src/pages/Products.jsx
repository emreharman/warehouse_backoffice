import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  addProduct,
  removeProduct,
  updateProductById,
} from "../redux/actions/productActions";
import { getCategories } from "../redux/actions/categoryActions";
import { getVariantOptions } from "../redux/actions/variantOptionActions";
import { uploadProductImage } from "../utils/uploadImage";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const initialFormData = {
  name: "",
  category: "",
  type: "",
  price: "",
  stock: "",
  images: [],
  description: "",
  tags: "",
  attributes: {
    color: "",
    size: "",
    quality: "",
    fit: "",
  },
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
  const { data: variantOptions } = useSelector((state) => state.variantOptions);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
    dispatch(getVariantOptions());
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
    if (["color", "size", "quality", "fit"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      type: product.type || "",
      price: product.price || "",
      stock: product.stock || "",
      images: product.images || [],
      description: product.description || "",
      tags: product.tags?.join(", ") || "",
      attributes: product.variants?.[0]?.attributes || {
        color: "",
        size: "",
        quality: "",
        fit: "",
      },
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { name, category, type, price, stock, images, description, tags } =
      formData;

      if (!name.trim()) return alert("Ürün adı gerekli.");
      if (!category) return alert("Kategori seçilmelidir.");
      if (!type) return alert("Ürün türü seçilmelidir.");
      if (!price) return alert("Fiyat girilmelidir.");
      if (!stock) return alert("Stok girilmelidir.");

    const variant = formData.attributes.color
      ? { attributes: formData.attributes }
      : null;

    const payload = {
      name: name.trim(),
      category,
      type,
      price: parseFloat(price),
      stock: parseInt(stock),
      images,
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      variants: variant ? [variant] : [],
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

  const renderVariantSelectors = () => {
    if (formData.type === "o") return null;
    return (
      <div className="grid grid-cols-2 gap-4">
        {["color", "size", "quality", "fit"].map((attr) => (
          <div key={attr}>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor={attr}>
              {attr.charAt(0).toUpperCase() + attr.slice(1)}
            </label>
            <select
              id={attr}
              name={attr}
              value={formData.attributes[attr] || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2">
              <option value="">Seçiniz</option>
              {variantOptions?.[attr]?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Ürünler</h1>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}>
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
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Adı</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Fiyat</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, idx) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{product.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.category?.name || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{product.price} ₺</td>
                  <td className="px-4 py-2 text-gray-700">{product.stock}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(product)}>
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(product)}>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}>
        <div className="w-full max-w-3xl mx-auto max-h-[80vh] overflow-y-auto p-4 sm:rounded-lg space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adı
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2">
              <option value="">Seçiniz</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tür
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2">
              <option value="">Seçiniz</option>
              <option value="t">Tişört</option>
              <option value="h">Hoodie</option>
              <option value="c">Çocuk</option>
              <option value="o">Diğer</option>
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
                className="w-full border border-gray-300 rounded-md px-4 py-2"
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
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          {renderVariantSelectors()}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Resimleri
            </label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={handleFilesChange}
              disabled={uploading}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              En fazla {MAX_IMAGE_COUNT} görsel yükleyebilirsiniz.
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
                      title="Kaldır">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiketler (virgülle)
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {selectedProduct ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </div>
      </Modal>
      {/* ✔️ Silme Onayı Modali */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Ürünü Sil">
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

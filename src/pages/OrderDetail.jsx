import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../api/orders";
import LoadingSpinner from "../components/LoadingSpinner";

const statusLabels = {
  pre_payment: "Ödeme Bekleniyor",
  pending: "Onay Bekliyor",
  in_progress: "Üretimde",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const productTypes = {
  t: "Tişört",
  h: "Hodie",
  c: "Çocuk",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrder(id);
        setOrder(data);
      } catch (err) {
        setError("Sipariş alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sipariş Detayı</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div className="mt-2">
          <strong>Sipariş No:</strong> #{order._id}
        </div>
        <div>
          <strong>Tarih:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
        </div>
        <div>
          <strong>Durum:</strong> {statusLabels[order.status] || order.status}
        </div>
        <div>
          <strong>Toplam Tutar:</strong> {order.totalPrice || 0} ₺
        </div>
        <div>
          <strong>Tip:</strong> {order.type}
        </div>
        <div>
          <strong>Not:</strong> {order.note || "-"}
        </div>
        <div>
          <strong>Shopier Sipariş Numarası:</strong> {order?.platform_order_id || "-"}
        </div>
      </div>

      <hr />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">Müşteri Bilgisi</h2>
        <p>
          <strong>İsim:</strong> {order.customer?.name}
        </p>
        <p>
          <strong>Telefon:</strong> {order.customer?.phone}
        </p>
        <p>
          <strong>Email:</strong> {order.customer?.email}
        </p>
      </div>

      <hr />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">Teslimat Bilgileri</h2>
        <p>
          <strong>Adres:</strong> {order.address?.line1}
        </p>
        <p>
          <strong>Şehir:</strong> {order.address?.city}
        </p>
      </div>

      <hr />

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ürünler</h2>
        {Array.isArray(order.items) && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <strong>Ürün Tipi:</strong> {productTypes[item.productType]}
                </div>
                <div>
                  <strong>Adet:</strong> {item.quantity}
                </div>
                <div>
                  <strong>Renk:</strong> {item.selectedVariant?.color}
                </div>
                <div>
                  <strong>Beden:</strong> {item.selectedVariant?.size}
                </div>
                <div>
                  <strong>Kumaş Kalitesi:</strong>{" "}
                  {item.selectedVariant?.quality}
                </div>
                <div>
                  <strong>Kalıp:</strong> {item.selectedVariant?.fit}
                </div>
                <div>
                  <strong>Fiyat:</strong> {item.price || 0} ₺
                </div>
                <div>
                  <strong>İndirim:</strong>{" "}
                  {item.selectedVariant?.discount || 0} ₺
                </div>
              </div>

              {item.designMeta && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Tasarım Detayı
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p>
                      <strong>Yüz:</strong> {item.designMeta.side}
                    </p>
                    <p>
                      <strong>Boyut:</strong> {item.designMeta.size}
                    </p>
                    <p>
                      <strong>Konum:</strong> {item.designMeta.position}
                    </p>
                    <p>
                      <strong>Pixel Pozisyonu:</strong> x:
                      {item.designMeta.pixelPosition?.x}, y:
                      {item.designMeta.pixelPosition?.y}
                    </p>
                    <p>
                      <strong>Dosya:</strong> {item.designMeta.fileName}
                    </p>
                    {item.designMeta.finalDesign && (
                      <div className="flex flex-col items-start mt-3">
                        <img
                          src={item.designMeta.finalDesign}
                          alt="Final Design"
                          onClick={() =>
                            setModalImage(item.designMeta.finalDesign)
                          }
                          className="h-32 w-auto cursor-pointer border rounded shadow hover:opacity-90"
                        />
                        <a
                          href={item.designMeta.finalDesign}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">
                          Yeni Sekmede Aç
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.designFiles?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Üyklenen Dosyalar:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {item.designFiles.map((fileUrl, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={fileUrl}
                          alt={`Design File ${i + 1}`}
                          onClick={() => setModalImage(fileUrl)}
                          className="h-20 w-20 object-cover border rounded shadow cursor-pointer hover:opacity-90"
                        />
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                          Yeni Sekmede Aç
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Ürün bulunamadı.</p>
        )}
      </div>

      {/* Görsel modalı */}
      {modalImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl w-full p-4">
            <img
              src={modalImage}
              alt="Büyütülmüş Görsel"
              className="w-full h-auto max-h-[90vh] object-contain rounded shadow"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 shadow hover:bg-gray-200"
              title="Kapat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

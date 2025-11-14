import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import BarangForm from "../../../components/barang/form";
import { AdminLayout } from "../../../layouts";
import { updateBarang, getBarangById } from "../../../utils/apis";

const BarangEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barang, setBarang] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        if (!id) throw new Error("ID barang tidak ditemukan");

        const response = await getBarangById(id);
        // ✅ ambil data dari response.data jika API return { data: {...} }
        const data = response?.data?.data || response?.data || response;

        if (!data) throw new Error("Data barang tidak ditemukan");

        setBarang(data);
      } catch (err: any) {
        message.error(err.message || "Terjadi kesalahan saat memuat data");
        // fallback: kembali ke list barang
        setTimeout(() => navigate("/admin/barang"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, [id, navigate]);

  const handleUpdate = async (formData: FormData) => {
    try {
      if (!id) throw new Error("ID barang tidak valid");

      const response = await updateBarang(id, formData);
      const data = response?.data?.data || response?.data || response;

      if (!data) throw new Error("Gagal memperbarui barang");

      message.success("Barang berhasil diperbarui");
      navigate("/admin/barang");
    } catch (err: any) {
      console.error("Update error:", err); // debug log
      message.error(err.message || "Terjadi kesalahan server");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" tip="Memuat data barang..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen flex justify-center items-start py-10 bg-gray-50">
        <div className="w-full max-w-2xl">
          {barang ? (
            <BarangForm
              initialValues={barang}
              onSubmit={handleUpdate}
              mode="edit"
            />
          ) : (
            <message.error>Data barang tidak ditemukan</message.error>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BarangEdit;

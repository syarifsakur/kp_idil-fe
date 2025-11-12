import React from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { createPeminjaman } from "../../../utils/apis";
import { PinjamForm } from "../../../components/peminjaman";
import { AdminLayout } from "../../../layouts";

const PeminjamanCreate: React.FC = () => {
  const navigate = useNavigate();

  // 🔹 Fungsi ketika form disubmit
  const handleSubmit = async (values: any) => {
    try {
      // Kirim data ke backend
      const res = await createPeminjaman(values);

      // Notifikasi sukses
      message.success(res.data?.message || "Peminjaman berhasil ditambahkan");

      // Redirect kembali ke daftar peminjaman
      navigate("/admin/peminjaman");
    } catch (err: any) {
      console.error(
        "Error create peminjaman:",
        err.response?.data || err.message
      );
      message.error(err.response?.data?.message || "Gagal menambahkan peminjaman");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <PinjamForm mode="create" onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
};

export default PeminjamanCreate;

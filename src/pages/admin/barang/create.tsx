import React from "react";
import { message } from "antd";
import BarangForm from "../../../components/barang/form";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../layouts";
import { createBarang } from "../../../utils/apis";

const BarangCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      // createBarang sudah mengembalikan hasil JSON
      const data = await createBarang(formData);

      if (!data || data.error || data.img)
        throw new Error(data?.img || data?.message || "Gagal menambah barang");

      message.success("Barang berhasil ditambahkan");
      navigate("/admin/barang");
    } catch (error: any) {
      message.error(error.message || "Terjadi kesalahan server");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex justify-center items-start py-10 bg-gray-50">
        <div className="w-full max-w-2xl">
          <BarangForm onSubmit={handleSubmit} mode="create" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default BarangCreate;

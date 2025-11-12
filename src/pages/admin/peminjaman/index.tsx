import React from "react";
import { AdminLayout } from "../../../layouts";
import { PinjamDefault } from "../../../components/peminjaman";

const PeminjamanBarang: React.FC = () => {
  return (
    <AdminLayout>
        <PinjamDefault/>
    </AdminLayout>
  );
};

export default PeminjamanBarang;

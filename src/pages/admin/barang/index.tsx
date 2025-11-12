import React from "react";
import { AdminLayout } from "../../../layouts";
import { BarangDefault } from "../../../components/barang";

const BarangPages: React.FC = () => {
  return (
    <AdminLayout>
        <BarangDefault/>
    </AdminLayout>
  );
};

export default BarangPages;

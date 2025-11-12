import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, Input, Button, Grid, Space, Card, message } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { peminjamanColumns } from "../../../columns/peminjaman.columns";
import { getRiwayatPeminjaman, updateStatusPeminjaman } from "../../../utils/apis";

const { Search } = Input;
const { useBreakpoint } = Grid;

interface Peminjaman {
  uuid?: string;
  nama_peminjam: string;
  barang_id: string;
  barang_name?: string;
  jumlah: number;
  tanggal_pinjam: string;
  status: string;
}

const sampleData: Peminjaman[] = [
  {
    uuid: "sample-1",
    nama_peminjam: "Andi Saputra",
    barang_id: "2a90d918-fe26-4950-8b8e-e06237dcfd05",
    barang_name: "Contoh Barang",
    jumlah: 2,
    tanggal_pinjam: "2025-11-11T00:00:00.000Z",
    status: "dipinjam",
  },
];

const PeminjamanDefault: React.FC = () => {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [query, setQuery] = useState("");
  const searchTimer = useRef<number | null>(null);

  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);

  // 🔹 Ambil data peminjaman
  const fetchAll = async () => {
    setLoading(true);
    try {
      const resP = await getRiwayatPeminjaman();
      const list = Array.isArray(resP?.data?.response)
        ? resP.data.response
        : Array.isArray(resP?.response)
        ? resP.response
        : [];

      const mapped = list.map((item: any) => ({
        uuid: item.uuid,
        nama_peminjam: item.nama_peminjam,
        barang_id: item.barang_id,
        barang_name: item.barang?.nama_barang || "",
        jumlah: item.jumlah ?? 0,
        tanggal_pinjam: item.tanggal_pinjam,
        status: item.status,
      }));

      setData(mapped);
    } catch (err: any) {
      console.error("Gagal ambil data:", err.response?.data || err.message);
      message.warning("Gagal mengambil data peminjaman, menampilkan data contoh.");
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔹 Update status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateStatusPeminjaman(id, newStatus);
      message.success(res.data?.message || "Status berhasil diperbarui");
      await fetchAll(); // refresh data
    } catch (err: any) {
      console.error("Update status error:", err.response?.data || err.message);
      message.error("Gagal memperbarui status");
    }
  };

  // 🔹 Pencarian
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(
      (d) =>
        d.nama_peminjam.toLowerCase().includes(q) ||
        (d.barang_name || "").toLowerCase().includes(q) ||
        (d.status || "").toLowerCase().includes(q) ||
        dayjs(d.tanggal_pinjam).format("YYYY-MM-DD").includes(q)
    );
  }, [data, query]);

  const handleTableChange = (pager: any) => {
    setPagination({ current: pager.current, pageSize: pager.pageSize });
  };

  // 🔹 Layout
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
      <Space
        direction={isMobile ? "vertical" : "horizontal"}
        className="w-full mb-4"
        size={isMobile ? "small" : "middle"}
        style={{ justifyContent: "space-between" }}
      >
        <Search
          placeholder="Cari nama peminjam / barang / status / tanggal"
          allowClear
          onSearch={(val) => setQuery(val)}
          onChange={(e) => {
            const v = e.target.value;
            if (searchTimer.current) window.clearTimeout(searchTimer.current);
            searchTimer.current = window.setTimeout(() => setQuery(v), 300);
          }}
          style={{ width: isMobile ? "100%" : 360 }}
        />

        {/* ✅ Tombol Tambah Data seperti BarangDefault */}
        <Button
          onClick={() => navigate("/admin/peminjaman/create")}
          type="primary"
          size={isMobile ? "middle" : "large"}
          block={isMobile}
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          Tambah Peminjaman
        </Button>
      </Space>

      <div className="overflow-x-auto">
        <Table
          columns={
            peminjamanColumns({
              current: pagination.current,
              pageSize: pagination.pageSize,
              onStatusChange: handleStatusChange,
            }) as ColumnsType<any>
          }
          dataSource={filtered.map((item, index) => ({
            ...item,
            no: (pagination.current - 1) * pagination.pageSize + (index + 1),
          }))}
          rowKey="uuid"
          loading={loading}
          size={isMobile ? "small" : "middle"}
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filtered.length,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            showSizeChanger: false,
            position: isMobile ? ["bottomCenter"] : ["bottomRight"],
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default PeminjamanDefault;

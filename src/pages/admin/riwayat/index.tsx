import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table, Card, Space, Input, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AdminLayout } from "../../../layouts";
import { riwayat } from "../../../utils/apis";
import dayjs from "dayjs";

const { Search } = Input;

interface Peminjaman {
  uuid?: string;
  nama_peminjam: string;
  barang_id: string;
  barang_name?: string;
  jumlah: number;
  tanggal_pinjam: string;
  tanggal_kembali_direncanakan: string;
  tanggal_kembali_actual?: string;
  status: string;
}

const Riwayat: React.FC = () => {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const searchTimer = useRef<number | null>(null);

  // 🔹 Ambil data dari API
  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const res = await riwayat();
      const list = Array.isArray(res?.data?.response)
        ? res.data.response
        : Array.isArray(res?.response)
        ? res.response
        : [];

      // 🔹 Filter hanya yang hilang / dikembalikan
      const filtered = list.filter(
        (item: any) =>
          item.status?.toLowerCase() === "hilang" ||
          item.status?.toLowerCase() === "dikembalikan"
      );

      const mapped = filtered.map((item: any) => ({
        uuid: item.uuid,
        nama_peminjam: item.nama_peminjam,
        barang_id: item.barang_id,
        barang_name: item.barang?.nama_barang || "",
        jumlah: item.jumlah,
        tanggal_pinjam: item.tanggal_pinjam,
        tanggal_kembali_direncanakan: item.tanggal_kembali_direncanakan,
        tanggal_kembali_actual: item.tanggal_kembali_actual,
        status: item.status,
      }));

      setData(mapped);
    } catch (err: any) {
      console.error("Gagal memuat riwayat:", err.response?.data || err.message);
      message.error("Gagal memuat data riwayat peminjaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // 🔎 Filter pencarian
  const filteredData = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(
      (d) =>
        (d.nama_peminjam || "").toLowerCase().includes(q) ||
        (d.barang_name || "").toLowerCase().includes(q) ||
        (d.status || "").toLowerCase().includes(q) ||
        dayjs(d.tanggal_pinjam).format("YYYY-MM-DD").includes(q)
    );
  }, [data, query]);

  const handleTableChange = (pager: any) => {
    setPagination({ current: pager.current, pageSize: pager.pageSize });
  };

  // 🔹 Kolom tabel
  const columns: ColumnsType<Peminjaman> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + (index + 1),
    },
    {
      title: "Nama Peminjam",
      dataIndex: "nama_peminjam",
      key: "nama_peminjam",
      align: "left",
    },
    {
      title: "Nama Barang",
      dataIndex: "barang_name",
      key: "barang_name",
      align: "left",
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
      align: "center",
    },
    {
      title: "Tanggal Pinjam",
      dataIndex: "tanggal_pinjam",
      key: "tanggal_pinjam",
      align: "center",
      render: (val: string) => (val ? dayjs(val).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Tanggal Kembali (Rencana)",
      dataIndex: "tanggal_kembali_direncanakan",
      key: "tanggal_kembali_direncanakan",
      align: "center",
      render: (val: string) => (val ? dayjs(val).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Tanggal Kembali (Actual)",
      dataIndex: "tanggal_kembali_actual",
      key: "tanggal_kembali_actual",
      align: "center",
      render: (val: string) => (val ? dayjs(val).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        const color =
          status === "hilang"
            ? "red"
            : status === "dikembalikan"
            ? "green"
            : "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <AdminLayout>
      <Card title="Riwayat Peminjaman Barang">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Search
            placeholder="Cari nama / barang / status / tanggal"
            allowClear
            onSearch={(val) => setQuery(val)}
            onChange={(e) => {
              const v = e.target.value;
              if (searchTimer.current) window.clearTimeout(searchTimer.current);
              searchTimer.current = window.setTimeout(() => setQuery(v), 300);
            }}
            style={{ width: 360 }}
          />

          <Table
            rowKey={(record) => record.uuid || record.barang_id}
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              showTotal: (total) => `Total ${total} item`,
            }}
            onChange={handleTableChange}
          />
        </Space>
      </Card>
    </AdminLayout>
  );
};

export default Riwayat;

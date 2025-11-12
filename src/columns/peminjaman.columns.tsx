import React from "react";
import type { ColumnsType } from "antd/es/table";
import { Select, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";

export const peminjamanColumns: (opts: {
  current: number;
  pageSize: number;
  onStatusChange?: (id: string, status: string) => void;
}) => ColumnsType<any> = ({ current, pageSize, onStatusChange }) => [
  {
    key: "no",
    title: "No.",
    align: "center",
    render: (_: any, __: any, index: number) =>
      (current - 1) * pageSize + index + 1,
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (value: string, record: any) => {
      const handleChange = async (newStatus: string) => {
        try {
          if (onStatusChange) {
            onStatusChange(record.uuid, newStatus);
          } else {
            await axios.put(`/api/peminjaman/${record.uuid}`, {
              status: newStatus,
            });
            message.success("Status berhasil diperbarui");
          }
        } catch (err) {
          console.error(err);
          message.error("Gagal memperbarui status");
        }
      };

      return (
        <Select
          value={value}
          style={{ width: 150 }}
          onChange={handleChange}
          options={[
            { label: "Dipinjam", value: "dipinjam" },
            { label: "Hilang", value: "hilang" },
            { label: "Dikembalikan", value: "dikembalikan" },
          ]}
        />
      );
    },
  },
];

import { Button, Tooltip, Popconfirm, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MdDelete, MdEdit } from "react-icons/md";

export const barangColumns: (pagination: {
  current: number;
  pageSize: number;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
}) => ColumnsType<any> = ({ current, pageSize, onDelete, onEdit }) => [
  {
    key: "no",
    title: "NO.",
    align: "center",
    render: (_, __, index) => (current - 1) * pageSize + index + 1,
  },
  {
    title: "Nama Barang",
    dataIndex: "nama_barang",
    key: "nama_barang",
    align: "center",
    render: (text) => <span>{text || "-"}</span>,
  },
  {
    title: "Kategori",
    dataIndex: "kategori",
    key: "kategori",
    align: "center",
    render: (text) => <span>{text || "-"}</span>,
  },
  {
    title: "Stok",
    dataIndex: "stok",
    key: "stok",
    align: "center",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Kondisi",
    dataIndex: "kondisi",
    key: "kondisi",
    align: "center",
    render: (text) => (
      <span
        className={`px-2 py-1 rounded ${
          text?.toLowerCase() === "baik"
            ? "bg-green-100 text-green-700"
            : text?.toLowerCase() === "rusak"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {text || "-"}
      </span>
    ),
  },
  {
    title: "Gambar",
    dataIndex: "path_img",
    key: "path_img",
    align: "center",
    render: (path) => {
      if (!path) return <span>-</span>;

      const imageUrl = path.startsWith("http")
        ? path
        : `http://localhost:2021/${path}`;

      return (
        <Image
          src={imageUrl}
          alt="barang"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="https://via.placeholder.com/60?text=No+Image"
        />
      );
    },
  },
  {
    key: "uuid",
    title: "AKSI",
    dataIndex: "uuid",
    align: "center",
    render: (value, record) => (
      <div className="flex justify-center space-x-2">
        <Tooltip title="Edit">
          <Button
            htmlType="button"
            type="text"
            onClick={() => onEdit(value)}
            className="cursor-pointer"
          >
            <MdEdit className="text-lg text-blue-600" />
          </Button>
        </Tooltip>

        <Popconfirm
          title={`Yakin menghapus barang "${record.nama_barang}"?`}
          onConfirm={() => onDelete(value)}
          okText="Ya"
          cancelText="Tidak"
        >
          <Tooltip title="Hapus">
            <Button htmlType="button" type="text" className="cursor-pointer">
              <MdDelete className="text-lg text-red-600" />
            </Button>
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];

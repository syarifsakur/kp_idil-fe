import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
  Card,
  Space,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { fetchBarang } from "../../../utils/apis";
import dayjs from "dayjs";

interface PeminjamanFormProps {
  initialValues?: any; // untuk edit mode
  onSubmit: (values: any) => void;
  mode: "create" | "edit";
}

const PeminjamanForm: React.FC<PeminjamanFormProps> = ({
  initialValues,
  onSubmit,
  mode,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [barangList, setBarangList] = useState<any[]>([]);

  useEffect(() => {
    // ambil daftar barang untuk dropdown
    const fetchBarangs = async () => {
      try {
        const res = await fetchBarang();
        const list = res?.data?.data || res?.data?.response || res?.data || [];
        setBarangList(list);
      } catch (err) {
        console.error("Gagal memuat barang:", err);
        message.error("Gagal memuat daftar barang.");
      }
    };
    fetchBarangs();
  }, []);

  useEffect(() => {
    // isi form ketika di-edit
    if (initialValues) {
      form.setFieldsValue({
        nama_peminjam: initialValues.nama_peminjam,
        barang_id: initialValues.barang_id,
        jumlah: initialValues.jumlah,
        tanggal_pinjam: initialValues.tanggal_pinjam
          ? dayjs(initialValues.tanggal_pinjam)
          : null,
        tanggal_kembali_direncanakan: initialValues.tanggal_kembali_direncanakan
          ? dayjs(initialValues.tanggal_kembali_direncanakan)
          : null,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const payload = {
      nama_peminjam: values.nama_peminjam,
      barang_id: values.barang_id,
      jumlah: values.jumlah,
      tanggal_pinjam: values.tanggal_pinjam.format("YYYY-MM-DD"),
      tanggal_kembali_direncanakan: values.tanggal_kembali_direncanakan.format("YYYY-MM-DD"),
    };
    onSubmit(payload);
  };

  return (
    <Card title={mode === "edit" ? "Edit Peminjaman" : "Tambah Peminjaman"}>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Nama Peminjam"
          name="nama_peminjam"
          rules={[{ required: true, message: "Nama peminjam wajib diisi" }]}
        >
          <Input placeholder="Masukkan nama peminjam" />
        </Form.Item>

        <Form.Item
          label="Barang"
          name="barang_id"
          rules={[{ required: true, message: "Pilih barang yang dipinjam" }]}
        >
          <Select placeholder="Pilih barang">
            {barangList.map((b) => (
              <Select.Option key={b.uuid} value={b.uuid}>
                {b.nama_barang}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Jumlah"
          name="jumlah"
          rules={[{ required: true, message: "Masukkan jumlah barang" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tanggal Pinjam"
          name="tanggal_pinjam"
          rules={[{ required: true, message: "Tanggal pinjam wajib diisi" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tanggal Kembali (Rencana)"
          name="tanggal_kembali_direncanakan"
          rules={[{ required: true, message: "Tanggal kembali wajib diisi" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Space className="w-full flex justify-between">
          <Button onClick={() => navigate("/admin/peminjaman")}>Kembali</Button>
          <Button type="primary" htmlType="submit">
            {mode === "edit" ? "Update" : "Simpan"}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default PeminjamanForm;

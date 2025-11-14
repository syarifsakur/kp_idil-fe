import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Upload, Select, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface BarangFormProps {
  initialValues?: any;
  onSubmit: (formData: FormData) => void;
  mode: "create" | "edit";
}

const BarangForm: React.FC<BarangFormProps> = ({ initialValues, onSubmit, mode }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      const fileList = initialValues.path_img
        ? [
            {
              uid: "-1",
              name: initialValues.nama_barang || "gambar.png",
              status: "done",
              url: initialValues.path_img,
            },
          ]
        : [];

      form.setFieldsValue({
        nama_barang: initialValues.nama_barang,
        kategori: initialValues.kategori,
        stok: initialValues.stok,
        kondisi: initialValues.kondisi,
        file: fileList,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const formData = new FormData();
    formData.append("nama_barang", values.nama_barang);
    formData.append("kategori", values.kategori);
    formData.append("stok", values.stok);
    formData.append("kondisi", values.kondisi);

    // 🔹 jika user upload file baru, ambil dari originFileObj
    if (values.file && values.file[0]) {
      const fileObj = values.file[0].originFileObj;
      if (fileObj) {
        formData.append("file", fileObj);
      }
    }

    onSubmit(formData);
  };

  return (
    <Card title={mode === "edit" ? "Edit Barang" : "Tambah Barang"}>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item label="Nama Barang" name="nama_barang" rules={[{ required: true }]}>
          <Input placeholder="Masukkan nama barang" />
        </Form.Item>

        <Form.Item label="Kategori" name="kategori" rules={[{ required: true }]}>
          <Select placeholder="Pilih kategori">
            <Select.Option value="elektronik">Elektronik</Select.Option>
            <Select.Option value="furniture">Furniture</Select.Option>
            <Select.Option value="kendaraan">Kendaraan</Select.Option>
            <Select.Option value="lainnya">Lainnya</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Stok" name="stok" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Kondisi" name="kondisi" rules={[{ required: true }]}>
          <Select placeholder="Pilih kondisi">
            <Select.Option value="baik">Baik</Select.Option>
            <Select.Option value="rusak ringan">Rusak Ringan</Select.Option>
                        <Select.Option value="rusak berat">Rusak Berat</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Upload Gambar"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
          </Upload>
        </Form.Item>

        <Space className="w-full flex justify-between">
          <Button onClick={() => navigate("/admin/barang")}>Kembali</Button>
          <Button type="primary" htmlType="submit">
            {mode === "edit" ? "Update" : "Simpan"}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default BarangForm;

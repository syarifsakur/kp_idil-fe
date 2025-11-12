import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card } from "antd";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/plots";
import { getRiwayatPeminjaman, fetchBarang,riwayat } from "../../../utils/apis";
import { AdminLayout } from "../../../layouts";

const { Content } = Layout;

const Dashboard: React.FC = () => {
  const [totalBarang, setTotalBarang] = useState<number>(0);
  const [peminjamanAktif, setPeminjamanAktif] = useState<number>(0);
  const [barangKembali, setBarangKembali] = useState<number>(0);
  const [barangHilang, setBarangHilang] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const barangRes = await fetchBarang();
        const pinjamRes = await getRiwayatPeminjaman();
        const riwayatRes = await riwayat();

        const listBarang = barangRes?.data?.response || [];
        const listPinjam = pinjamRes?.data?.response || [];
        const listRiwayat = riwayatRes?.data?.response || [];

        setTotalBarang(listBarang.length);
        setPeminjamanAktif(
          listPinjam.filter((i: any) => i.status === "dipinjam").length
        );
        setBarangKembali(
          listRiwayat.filter((i: any) => i.status === "dikembalikan").length
        );
        setBarangHilang(
          listRiwayat.filter((i: any) => i.status === "hilang").length
        );
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Dummy data grafik — bisa diganti dari API statistik bulanan
  const data = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 15 },
    { month: "Mar", value: 8 },
    { month: "Apr", value: 22 },
    { month: "May", value: 30 },
    { month: "Jun", value: 25 },
  ];

  const config = {
    data,
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#2563eb",
    point: { size: 5, shape: "diamond" },
    tooltip: { showMarkers: true },
    areaStyle: { fill: "l(270) 0:#3b82f6 1:#93c5fd" },
  };

  return (
    <AdminLayout>
      <Content className="m-6">
        {/* Statistik Cards */}
        <Row gutter={[16, 16]}>
          {/* Total Barang */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              className="relative shadow-lg h-40 rounded-2xl overflow-hidden text-white"
              bodyStyle={{ height: "100%", padding: "1.5rem" }}
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              }}
            >
              <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-white/20 rounded-full"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingOutlined className="text-2xl opacity-90" />
                  <span className="text-xl font-semibold">Total Barang</span>
                </div>
                <div>
                  <div className="text-4xl font-bold">{totalBarang}</div>
                  <div className="text-sm opacity-80">Data Barang</div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Peminjaman Aktif */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              className="relative shadow-lg h-40 rounded-2xl overflow-hidden text-white"
              bodyStyle={{ height: "100%", padding: "1.5rem" }}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              }}
            >
              <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-white/20 rounded-full"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-2xl opacity-90" />
                  <span className="text-xl font-semibold">
                    Peminjaman Aktif
                  </span>
                </div>
                <div>
                  <div className="text-4xl font-bold">{peminjamanAktif}</div>
                  <div className="text-sm opacity-80">Masih Dipinjam</div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Barang Dikembalikan */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              className="relative shadow-lg h-40 rounded-2xl overflow-hidden text-white"
              bodyStyle={{ height: "100%", padding: "1.5rem" }}
              style={{
                background: "linear-gradient(135deg, #facc15 0%, #fde047 100%)",
              }}
            >
              <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-white/20 rounded-full"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-2xl opacity-90" />
                  <span className="text-xl font-semibold">Dikembalikan</span>
                </div>
                <div>
                  <div className="text-4xl font-bold">{barangKembali}</div>
                  <div className="text-sm opacity-80">Sudah Kembali</div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Barang Hilang */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              className="relative shadow-lg h-40 rounded-2xl overflow-hidden text-white"
              bodyStyle={{ height: "100%", padding: "1.5rem" }}
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              }}
            >
              <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 bg-white/20 rounded-full"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2">
                  <WarningOutlined className="text-2xl opacity-90" />
                  <span className="text-xl font-semibold">Barang Hilang</span>
                </div>
                <div>
                  <div className="text-4xl font-bold">{barangHilang}</div>
                  <div className="text-sm opacity-80">Kehilangan</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Grafik */}
        <Row style={{ marginTop: "30px" }}>
          <Col xs={24}>
            <Card
              title="📊 Tren Peminjaman Barang"
              className="shadow-xl rounded-2xl"
              bodyStyle={{ padding: "1.5rem" }}
            >
              <Line {...config} />
            </Card>
          </Col>
        </Row>
      </Content>
    </AdminLayout>
  );
};

export default Dashboard;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, DatePicker, Button, Grid, Space } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { barangColumns } from "../../../columns/barang.columns"; // pastikan sudah ada columns-nya
import { deleteBarang, fetchBarang } from "../../../utils/apis"; // pastikan fungsi ini sudah ada
import type { Barang } from "../../../types/barang";
import { showNotification, showNotificationError } from "../../../utils";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const BarangDefault: React.FC = () => {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [filteredBarang, setFilteredBarang] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const searchTimer = useRef<number | null>(null);

  useEffect(() => {
    const getBarang = async () => {
      try {
        setIsLoading(true);
        const response = await fetchBarang();
        const list: Barang[] = response?.data?.response ?? [];
        setBarang(list);
        setFilteredBarang(list);
      } catch (error) {
        console.error("Error fetching barang:", error);
        showNotificationError("Gagal mengambil data barang!");
      } finally {
        setIsLoading(false);
      }
    };

    getBarang();
  }, []);

  useEffect(() => {
    const nextSize = isMobile ? 5 : 10;
    if (pagination.pageSize !== nextSize) {
      setPagination((p) => ({ ...p, pageSize: nextSize, current: 1 }));
    }
  }, [isMobile]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBarang(id);
      showNotification("Berhasil menghapus data!");
      setBarang((prev) => prev.filter((item) => item.uuid !== id));
      setFilteredBarang((prev) => prev.filter((item) => item.uuid !== id));
    } catch (error) {
      console.error(error);
      showNotificationError("Gagal menghapus data barang!");
    }
  };

  const handleEdit = (uuid: string) => {
    navigate(`/admin/barang/edit/${uuid}`);
  };

  const handleRangeFilter = (_dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);

    if (searchTimer.current) window.clearTimeout(searchTimer.current);

    searchTimer.current = window.setTimeout(() => {
      if (!dateStrings[0] || !dateStrings[1]) {
        setFilteredBarang(barang);
        setPagination((prev) => ({ ...prev, current: 1 }));
        return;
      }

      const [start, end] = dateStrings;
      const filtered = barang.filter((item) => {
        const createdAt = dayjs(item.createdAt).format("YYYY-MM-DD");
        return createdAt >= start && createdAt <= end;
      });

      setFilteredBarang(filtered);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 200);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
      <Space
        direction={isMobile ? "vertical" : "horizontal"}
        className="w-full mb-4"
        size={isMobile ? "small" : "middle"}
        style={{ justifyContent: "space-between" }}
      >

        <Button
          onClick={() => navigate("/admin/barang/create")}
          type="primary"
          size={isMobile ? "middle" : "large"}
          block={isMobile}
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          Tambah Data
        </Button>
      </Space>

      <div className="overflow-x-auto">
        <Table
          columns={barangColumns({
            current: pagination.current,
            pageSize: pagination.pageSize,
            onDelete: handleDelete,
            onEdit: handleEdit,
          })}
          dataSource={filteredBarang.map((item, index) => ({
            ...item,
            no: (pagination.current - 1) * pagination.pageSize + (index + 1),
          }))}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#cce0ff",
                    textAlign: "center",
                    color: "black",
                    fontSize: isMobile ? 12 : 14,
                    padding: isMobile ? "8px 6px" : "12px 8px",
                  }}
                />
              ),
            },
          }}
          rowKey="uuid"
          loading={isLoading}
          size={isMobile ? "small" : "middle"}
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredBarang.length,
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

export default BarangDefault;

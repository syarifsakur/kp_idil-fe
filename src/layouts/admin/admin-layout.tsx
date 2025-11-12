import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Breadcrumb, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  menuItems,
  removeItem,
  showNotification,
  showNotificationError,
} from "../../utils";
import { logout } from "../../utils/apis";
import logo from "../../assets/logo_bnpb.jpeg";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const foundItem = menuItems
      .flatMap((section: any) => section.items)
      .find((item: any) => currentPath.startsWith(item.path));
    if (foundItem) {
      setSelectedKey(foundItem.key);
    }
  }, [location.pathname]);

  const handleMenuClick = (path: string, key: string) => {
    setSelectedKey(key);
    navigate(path);
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: "Konfirmasi Logout",
      content: "Apakah Anda yakin ingin Logout?",
      okText: "Ya, Logout",
      cancelText: "Batal",
      okType: "danger",
      centered: true,
      onOk: async () => {
        try {
          await logout();
          removeItem("profile");
          showNotification("Logout berhasil!");
          navigate("/", { replace: true });
        } catch (err) {
          showNotificationError("Gagal logout, coba lagi.");
        }
      },
    });
  };

  const getBreadcrumbItems = () => {
    const currentPath = location.pathname;
    const breadcrumbItems: any[] = [
      { title: <HomeOutlined />, href: "/admin" },
    ];

    const foundItem = menuItems
      .flatMap((section: any) => section.items)
      .find((item: any) => currentPath.startsWith(item.path));

    if (foundItem) {
      breadcrumbItems.push({ title: foundItem.label });

      const subPath = currentPath
        .replace(foundItem.path, "")
        .split("/")
        .filter(Boolean);

      if (subPath.length > 0) {
        subPath.forEach((part) => {
          breadcrumbItems.push({
            title: part.charAt(0).toUpperCase() + part.slice(1),
          });
        });
      }
    }

    return breadcrumbItems;
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          overflow: "auto",
          backgroundColor: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 16px",
            background: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          {!collapsed && (
            <span style={{ marginLeft: 12, fontWeight: 700, fontSize: 18 }}>
              Admin
            </span>
          )}
        </div>

        <Menu
          style={{ backgroundColor: "#fff", borderRight: "none" }}
          mode="inline"
          selectedKeys={[selectedKey]}
        >
          {menuItems.map((section: any) => (
            <React.Fragment key={section.title}>
              <Menu.ItemGroup title={section.title}>
                {section.items.map((item: any) => (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={() => handleMenuClick(item.path, item.key)}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </React.Fragment>
          ))}

          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={confirmLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            height: 64,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 18,
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Header>

        <Content
          style={{
            height: "calc(100vh - 64px)",
            overflow: "auto",
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Breadcrumb items={getBreadcrumbItems()} />
          <div style={{ marginTop: 16 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, Space, Dropdown, Button, Tooltip, Grid } from "antd";
import type { MenuProps } from "antd";
import {
  BarChartOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  BulbOutlined,
  BulbFilled,
  UserOutlined,
  GlobalOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { useUiStore, type Lang } from "@/store/uiStore";
import { BRAND } from "@/theme/themeConfig";

const { Header } = Layout;

const LANG_LABEL: Record<Lang, string> = {
  "uz-cyrl": "ЎЗ",
  "uz-latn": "UZ",
  ru: "РУ",
};

export default function AppHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const lang = useUiStore((s) => s.lang);
  const setLang = useUiStore((s) => s.setLang);

  const selectedKey = useMemo(() => {
    if (pathname.startsWith("/dashboard")) return "statistics";
    if (pathname.startsWith("/management") || pathname.startsWith("/geo-dashboard"))
      return "general";
    if (pathname.startsWith("/gps-tracking") || pathname.startsWith("/geography")) return "gps";
    return "statistics";
  }, [pathname]);

  const navItems: MenuProps["items"] = [
    {
      key: "statistics",
      icon: <BarChartOutlined />,
      label: <Link href="/dashboard/statistics">{t("nav.statistics")}</Link>,
    },
    {
      key: "general",
      icon: <AppstoreOutlined />,
      label: t("nav.general"),
      children: [
        {
          key: "companies",
          label: <Link href="/management/all-companies">{t("nav.companies")}</Link>,
        },
        {
          key: "geo",
          label: <Link href="/geo-dashboard">{t("nav.geo")}</Link>,
        },
      ],
    },
    {
      key: "gps",
      icon: <EnvironmentOutlined />,
      label: t("nav.gps"),
      children: [
        {
          key: "gps-stats",
          label: <Link href="/gps-tracking/statistics">{t("nav.gpsStats")}</Link>,
        },
        {
          key: "monitoring",
          label: <Link href="/gps-tracking/gps">{t("nav.monitoring")}</Link>,
        },
        {
          key: "geography",
          label: t("nav.geography"),
          children: [
            { key: "geo-regions", label: <Link href="/geography/regions">{t("nav.regions")}</Link> },
            { key: "geo-districts", label: <Link href="/geography/districts">{t("nav.districts")}</Link> },
            { key: "geo-villages", label: <Link href="/geography/villages">{t("nav.mahallas")}</Link> },
            { key: "geo-areas", label: <Link href="/geography/mahalla-area">{t("nav.mahallaAreas")}</Link> },
            { key: "geo-sync", label: <Link href="/geography/mahalla-sync">{t("nav.mahallaSync")}</Link> },
          ],
        },
      ],
    },
  ];

  const langMenu: MenuProps = {
    items: (Object.keys(LANG_LABEL) as Lang[]).map((l) => ({
      key: l,
      label: LANG_LABEL[l] + (l === "uz-cyrl" ? " · Кирилл" : l === "uz-latn" ? " · Lotin" : " · Русский"),
    })),
    selectedKeys: [lang],
    onClick: ({ key }) => setLang(key as Lang),
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 24,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <Link href="/dashboard/statistics">
        <Space align="center" size={10}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: BRAND.green,
              display: "inline-block",
              boxShadow: `0 0 0 3px ${BRAND.greenSoft}`,
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 0.5,
              color: theme === "dark" ? "#e6edf3" : "#1f2937",
              whiteSpace: "nowrap",
            }}
          >
            TOZA HUDUD
          </span>
        </Space>
      </Link>

      {/* Nav */}
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={navItems}
        style={{ flex: 1, minWidth: 0, borderBottom: "none", background: "transparent" }}
        onClick={(info) => {
          if (info.key === "statistics") router.push("/dashboard/statistics");
        }}
      />

      {/* O'ng tarafdagi ikonalar */}
      <Space size={4}>
        {screens.md && (
          <Tooltip title={t("common.search")}>
            <Button type="text" icon={<SearchOutlined />} shape="circle" />
          </Tooltip>
        )}
        <Tooltip title={theme === "light" ? "Dark" : "Light"}>
          <Button
            type="text"
            shape="circle"
            icon={theme === "light" ? <BulbOutlined /> : <BulbFilled />}
            onClick={toggleTheme}
          />
        </Tooltip>
        <Dropdown menu={langMenu} trigger={["click"]}>
          <Button type="text" size="small" style={{ fontWeight: 600 }}>
            <Space size={4}>
              <GlobalOutlined />
              {LANG_LABEL[lang]}
              <DownOutlined style={{ fontSize: 9 }} />
            </Space>
          </Button>
        </Dropdown>
        <Button type="text" icon={<UserOutlined />} shape="circle" />
      </Space>
    </Header>
  );
}

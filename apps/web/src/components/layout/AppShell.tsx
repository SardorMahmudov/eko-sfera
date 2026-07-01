"use client";

import { Layout } from "antd";
import AppHeader from "./AppHeader";

const { Content } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content style={{ padding: 16 }}>{children}</Content>
    </Layout>
  );
}

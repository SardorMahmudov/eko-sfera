import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

// TOZA HUDUD brend ranglari (yashil, tekis — gradientsiz)
export const BRAND = {
  green: "#00c950",
  greenDark: "#00a843",
  greenSoft: "#e3faec",
  danger: "#e5484d",
  warning: "#f5a524",
};

const sharedTokens = {
  colorPrimary: BRAND.green,
  colorInfo: BRAND.green,
  colorSuccess: BRAND.green,
  borderRadius: 8,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    ...sharedTokens,
    colorBgLayout: "#eef1f4",
    colorBgContainer: "#ffffff",
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      headerHeight: 56,
      bodyBg: "#eef1f4",
    },
    Card: {
      borderRadiusLG: 10,
    },
    Table: {
      headerBg: "#fafafa",
      rowHoverBg: BRAND.greenSoft,
    },
    Menu: {
      itemSelectedColor: BRAND.green,
      itemColor: "#4b5563",
      horizontalItemSelectedColor: BRAND.green,
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...sharedTokens,
    colorBgLayout: "#0f141a",
    colorBgContainer: "#161b22",
  },
  components: {
    Layout: {
      headerBg: "#161b22",
      headerHeight: 56,
      bodyBg: "#0f141a",
    },
    Menu: {
      itemSelectedColor: BRAND.green,
      horizontalItemSelectedColor: BRAND.green,
    },
  },
};

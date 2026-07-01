"use client";

import { useEffect, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import "@ant-design/v5-patch-for-react-19";

import { darkTheme, lightTheme } from "@/theme/themeConfig";
import { useUiStore } from "@/store/uiStore";
import i18n from "@/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const lang = useUiStore((s) => s.lang);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  // Til o'zgarsa i18next ni yangilash
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);

  // <html> ustidagi rang sxemasi
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <AntdRegistry>
      <I18nextProvider i18n={i18n}>
        <ConfigProvider
          theme={theme === "dark" ? darkTheme : lightTheme}
          locale={lang === "ru" ? ruRU : undefined}
        >
          <AntdApp>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </AntdApp>
        </ConfigProvider>
      </I18nextProvider>
    </AntdRegistry>
  );
}

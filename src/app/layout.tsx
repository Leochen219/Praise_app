import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "匿名反馈 - 获得真实评价",
  description: "创建私密房间，分享链接给朋友，收集匿名反馈和真实评价",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
              📨 匿名反馈
            </a>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/join" className="text-gray-600 hover:text-gray-900 transition-colors">
                加入房间
              </a>
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                我的房间
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-200 bg-white">
          匿名反馈 — 了解更多真实的自己
        </footer>
      </body>
    </html>
  );
}

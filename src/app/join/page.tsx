"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 6) {
      setError("请输入完整的6位房间码");
      return;
    }
    router.push(`/room/${trimmed}`);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">加入房间</h1>
        <p className="text-gray-500 mb-8">
          输入朋友分享的房间码，留下你的匿名评价
        </p>
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="输入房间码，如 ABC123"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg text-center tracking-[0.3em] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            加入房间
          </button>
        </form>
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-700 text-sm mt-6 transition-colors"
        >
          ← 回到首页
        </button>
      </div>
    </div>
  );
}

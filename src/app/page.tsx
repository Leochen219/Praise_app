"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setJoinError("请输入房间码");
      return;
    }
    router.push(`/room/${code}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            匿名反馈
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            创建私密房间，分享链接给朋友，收集最真实的匿名评价
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    进入我的房间
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/register")}
                    className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    免费创建房间
                  </button>
                )}
                <button
                  onClick={() => document.getElementById("join-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  加入已有房间
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          三步获得真实反馈
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">创建房间</h3>
            <p className="text-gray-600">
              设置一个主题，比如&ldquo;对我演讲的反馈&rdquo;，系统会生成一个6位房间码
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">分享链接</h3>
            <p className="text-gray-600">
              把房间码或链接发给你的朋友、同事、同学，他们无需注册即可加入
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">查看反馈</h3>
            <p className="text-gray-600">
              朋友们匿名留言，你看到最真实的评价。完全匿名，没有人知道谁写了什么
            </p>
          </div>
        </div>
      </section>

      {/* Join Room Section */}
      <section id="join-section" className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">加入一个房间</h2>
          <p className="text-gray-600 mb-6">输入朋友分享的6位房间码，留下你的匿名评价</p>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setJoinError("");
              }}
              placeholder="输入房间码，如 ABC123"
              maxLength={6}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg text-center tracking-widest font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              加入
            </button>
          </form>
          {joinError && <p className="text-red-500 text-sm mt-2">{joinError}</p>}
        </div>
      </section>
    </div>
  );
}

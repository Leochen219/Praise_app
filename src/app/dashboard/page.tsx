"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  description: string;
  code: string;
  is_active: number;
  message_count: number;
  unread_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          router.push("/login");
          return;
        }
        setUser(data.data);
        return fetchRooms();
      })
      .finally(() => setLoading(false));
  }, [router, fetchRooms]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!name.trim()) {
      setCreateError("请输入房间名称");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setName("");
        setDescription("");
        setShowCreate(false);
        await fetchRooms();
      } else {
        setCreateError(data.error || "创建失败");
      }
    } catch {
      setCreateError("网络错误，请重试");
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("确定要删除这个房间吗？所有留言也会被删除。")) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
      }
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("已复制到剪贴板");
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的房间</h1>
          <p className="text-gray-500 text-sm mt-1">
            欢迎，{user?.username}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            {showCreate ? "取消" : "+ 创建房间"}
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* Create Room Form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">创建新房间</h2>
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
              房间名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="roomName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="如：对我的演讲的反馈、评价我的表现..."
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="roomDesc" className="block text-sm font-medium text-gray-700 mb-1">
              房间描述 <span className="text-gray-400">(可选)</span>
            </label>
            <textarea
              id="roomDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="给朋友们一些引导，如：请评价我今天演讲的表现..."
              rows={3}
              maxLength={500}
            />
          </div>
          {createError && <p className="text-red-500 text-sm">{createError}</p>}
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {creating ? "创建中..." : "创建房间"}
          </button>
        </form>
      )}

      {/* Room List */}
      {rooms.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 text-lg mb-4">还没有创建任何房间</p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            创建第一个房间
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                  {room.name}
                </h3>
                {room.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                    {room.unread_count} 条未读
                  </span>
                )}
              </div>
              {room.description && (
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {room.description}
                </p>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                  {room.code}
                </span>
                <button
                  onClick={() => copyToClipboard(room.code)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  复制
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{room.message_count} 条留言</span>
                <span>{new Date(room.created_at).toLocaleDateString("zh-CN")}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
                  className="flex-1 text-center text-sm bg-blue-50 text-blue-700 py-2 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  查看留言
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="text-sm text-gray-400 hover:text-red-500 py-2 px-2 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";

interface Message {
  id: string;
  room_id: string;
  content: string;
  is_read: number;
  created_at: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  code: string;
  is_active: number;
  created_at: string;
}

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      if (data.success) {
        setRoom(data.data);
        return true;
      } else {
        setError(data.error || "无法加载房间");
        return false;
      }
    } catch {
      setError("网络错误");
      return false;
    }
  }, [roomId]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/messages?limit=100`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data.messages);
      }
    } catch {
      // ignore
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom()
      .then((ok) => {
        if (ok) {
          return fetchMessages();
        }
      })
      .finally(() => setLoading(false));
  }, [fetchRoom, fetchMessages]);

  const markAllRead = async () => {
    try {
      await fetch(`/api/rooms/${roomId}/messages`, { method: "PUT" });
      setMessages((prev) => prev.map((m) => ({ ...m, is_read: 1 })));
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("已复制到剪贴板");
    });
  };

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/room/${room?.code}` : "";

  const relativeTime = (dateStr: string) => {
    const now = Date.now();
    const date = new Date(dateStr + "Z").getTime();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return new Date(dateStr).toLocaleDateString("zh-CN");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">{error || "房间不存在"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← 返回我的房间
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
      >
        ← 返回我的房间
      </button>

      {/* Room Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{room.name}</h1>
            {room.description && (
              <p className="text-gray-500 mt-1">{room.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              创建于 {new Date(room.created_at).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              room.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {room.is_active ? "接受留言中" : "已关闭"}
          </span>
        </div>

        {/* Share Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm font-medium text-blue-900 mb-3">
            📤 分享给朋友
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-blue-200">
              <span className="text-sm text-gray-500">房间码:</span>
              <span className="font-mono font-bold text-lg tracking-wider text-gray-900">
                {room.code}
              </span>
              <button
                onClick={() => copyToClipboard(room.code)}
                className="ml-auto text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                复制
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-blue-200">
              <span className="text-sm text-gray-500 truncate max-w-[200px]">
                {shareLink}
              </span>
              <button
                onClick={() => copyToClipboard(shareLink)}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                复制链接
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          收到的留言 ({messages.length})
        </h2>
        {messages.some((m) => !m.is_read) && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            全部标为已读
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-500 mb-2">还没有收到任何留言</p>
          <p className="text-gray-400 text-sm">
            把房间码 <span className="font-mono font-bold text-gray-600">{room.code}</span> 分享给朋友吧！
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border p-5 ${
                !msg.is_read ? "border-blue-300 bg-blue-50/50" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-gray-400">
                  {relativeTime(msg.created_at)}
                </span>
                {!msg.is_read && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    新消息
                  </span>
                )}
              </div>
              <p className="text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

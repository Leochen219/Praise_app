"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface RoomInfo {
  name: string;
  description: string;
  code: string;
  is_active: boolean;
}

export default function RoomJoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (!code) return;

    fetch(`/api/rooms/join/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoom(data.data);
        } else {
          setError(data.error || "房间不存在");
        }
      })
      .catch(() => setError("网络错误，请重试"))
      .finally(() => setLoading(false));
  }, [code]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError("");

    if (!content.trim()) {
      setSendError("请输入留言内容");
      return;
    }

    if (content.length > 1000) {
      setSendError("留言内容不能超过1000个字符");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/rooms/join/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        setContent("");
      } else {
        setSendError(data.error || "发送失败");
      }
    } catch {
      setSendError("网络错误，请重试");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">
          {error.includes("关闭") ? "🔒" : "🔍"}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {error.includes("关闭") ? "房间已关闭" : "房间不存在"}
        </h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          回到首页
        </button>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Room Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📨</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h1>
        {room.description && (
          <p className="text-gray-500">{room.description}</p>
        )}
        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          🔒 你的留言是完全匿名的
        </div>
      </div>

      {/* Message Form */}
      {!sent ? (
        <form
          onSubmit={handleSend}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              写下你想说的话...
            </label>
            <textarea
              id="message"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setSendError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="你的留言是完全匿名的，写下你最真实的想法..."
              rows={6}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {content.length}/1000
              </span>
            </div>
          </div>
          {sendError && <p className="text-red-500 text-sm">{sendError}</p>}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "发送中..." : "匿名发送"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">消息已发送！</h2>
          <p className="text-gray-500 mb-6">
            你的匿名留言已经发送给房间创建者
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSent(false)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              再写一条
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              回到首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

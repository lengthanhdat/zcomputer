"use client";

import { MessageCircle, PhoneCall, X, Send, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchApi } from "@/lib/api";

type Message = {
  _id?: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function FloatingContact() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Re-init when auth changes (login/logout)
  useEffect(() => {
    // If logged in, use userId as stable session; else use localStorage random session
    let sid: string;
    if (user?._id) {
      sid = `user_${user._id}`;
    } else {
      let storedSession = localStorage.getItem("chat_session_id");
      if (!storedSession) {
        storedSession = "sess_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("chat_session_id", storedSession);
      }
      sid = storedSession;
    }
    setSessionId(sid);
    setMessages([]);

    // Fetch history only if logged in (guest history not persisted)
    if (user?._id) {
      fetchApi(`/chat/session/${sid}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setMessages(data); })
        .catch(console.error);
    }

    // Reconnect socket with new session
    socketRef.current?.disconnect();
    socketRef.current = io(API_BASE || undefined, { path: '/socket.io' });
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join', sid);
    });
    socketRef.current.on('newMessage', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => { socketRef.current?.disconnect(); };
  }, [user?._id]);

  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      socketRef.current?.emit('markAsRead', { sessionId, isAdmin: false });
    }
  }, [messages, chatOpen, sessionId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current || !user?._id) return;
    socketRef.current.emit('sendMessage', {
      sessionId,
      content: input.trim(),
      isAdmin: false,
      senderId: user._id
    });
    setInput("");
  };

  return (
    <>
      {/* Chat Popup - opens to the LEFT of the button group */}
      {chatOpen && (
        <div className="fixed bottom-6 right-[88px] w-[340px] h-[480px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] flex flex-col z-50 overflow-hidden border border-gray-100">
          {/* Header - red flat design like GearVN */}
          <div className="bg-red-600 px-4 py-3 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <img src="/logo.png" alt="ZComputer" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-tight">ZComputer</h3>
                <p className="text-[11px] text-red-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                  Chat với chúng tôi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white p-1 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Guest warning banner */}
          {!user?._id && (
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2 shrink-0">
              <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
              <div className="text-xs text-amber-700 leading-relaxed">
                Lịch sử sẽ không được lưu.{" "}
                <a href="/login" className="text-red-600 font-bold hover:underline">Đăng nhập ngay</a>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 px-4 py-4 overflow-y-auto bg-white flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <Bot size={26} className="text-red-500" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {user?._id
                    ? 'Xin chào! Chúng tôi có thể giúp gì cho bạn?'
                    : 'Đăng nhập để bắt đầu cuộc trò chuyện và lưu lịch sử.'}
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                  {msg.isAdmin && (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Bot size={12} className="text-red-500" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed shadow-sm ${
                    msg.isAdmin
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                      : 'bg-red-600 text-white rounded-tr-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area - GearVN style: input + icon inside */}
          {user?._id ? (
            <form onSubmit={sendMessage} className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập nội dung..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="text-gray-400 hover:text-red-600 disabled:opacity-40 transition-colors shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          ) : (
            <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-full transition-colors text-sm"
              >
                🔐 Đăng nhập để chat
              </a>
            </div>
          )}

          {/* Branding footer */}
          <div className="px-4 pb-2 bg-white text-right shrink-0">
            <span className="text-[10px] text-gray-300 font-medium tracking-wide">ZComputer Support</span>
          </div>
        </div>
      )}

      {/* Floating buttons group */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Phone */}
        <a
          href="tel:0977334415"
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 transition-all group relative animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <PhoneCall size={24} />
          <span className="absolute right-16 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            0977 334 415
          </span>
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/0977334415"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-110 transition-all relative group"
        >
          <span className="font-bold text-xl">Zalo</span>
          <span className="absolute right-16 bg-blue-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Zalo ngay
          </span>
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/pcgamingthuduc"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-110 transition-all relative group"
        >
          <MessageCircle size={24} />
          <span className="absolute right-16 bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Facebook
          </span>
        </a>

        {/* Chat nội bộ */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all relative group"
        >
          {chatOpen ? <X size={22} /> : <MessageCircle size={24} />}
          <span className="absolute right-16 bg-red-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat với nhân viên
          </span>
        </button>
      </div>
    </>
  );
}

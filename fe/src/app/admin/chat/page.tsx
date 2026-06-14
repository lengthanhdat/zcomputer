"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, User, Search } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchApi } from "@/lib/api";

type Message = {
  _id?: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
};

type Session = {
  _id: string; // sessionId
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSessions();

    socketRef.current = io(API_BASE || undefined, { path: '/socket.io' });
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('joinAdmin');
    });

    socketRef.current.on('adminMessage', (msg: Message & { sessionId: string }) => {
      // If we are currently viewing this session, append and mark as read
      if (activeSession === msg.sessionId) {
        setMessages(prev => [...prev, msg]);
        socketRef.current?.emit('markAsRead', { sessionId: msg.sessionId, isAdmin: true });
      }
      
      // Update session list to show latest message
      setSessions(prev => {
        const existingIdx = prev.findIndex(s => s._id === msg.sessionId);
        let newSessions = [...prev];
        if (existingIdx >= 0) {
          const s = newSessions[existingIdx];
          s.lastMessage = msg.content;
          s.updatedAt = msg.createdAt;
          if (activeSession !== msg.sessionId && !msg.isAdmin) {
            s.unreadCount += 1;
          }
          newSessions.splice(existingIdx, 1);
          newSessions.unshift(s);
        } else {
          newSessions.unshift({
            _id: msg.sessionId,
            lastMessage: msg.content,
            updatedAt: msg.createdAt,
            unreadCount: msg.isAdmin ? 0 : 1
          });
        }
        return newSessions;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeSession]);

  useEffect(() => {
    if (activeSession) {
      fetchApi(`/chat/session/${activeSession}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
          messagesEndRef.current?.scrollIntoView();
          socketRef.current?.emit('markAsRead', { sessionId: activeSession, isAdmin: true });
          
          setSessions(prev => prev.map(s => s._id === activeSession ? { ...s, unreadCount: 0 } : s));
        })
        .catch(console.error);
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSessions = () => {
    fetchApi(`/chat/sessions`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(console.error);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current || !activeSession) return;
    
    socketRef.current.emit('sendMessage', {
      sessionId: activeSession,
      content: input.trim(),
      isAdmin: true,
      senderId: user?._id
    });
    
    setInput("");
  };

  return (
    <div className="pb-12 h-[80vh] flex flex-col">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <div className="p-3 bg-white shadow-sm border border-gray-200 rounded-xl">
          <MessageCircle size={24} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chat với khách hàng</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Hỗ trợ và tư vấn trực tuyến</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Tìm đoạn chat..." className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessions.map(session => (
              <button
                key={session._id}
                onClick={() => setActiveSession(session._id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-red-50 transition-colors flex items-start gap-3 ${activeSession === session._id ? 'bg-red-50 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-1">
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">Khách #{session._id.substring(session._id.length - 4)}</h4>
                    {session.unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
                </div>
              </button>
            ))}
            {sessions.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">Chưa có tin nhắn nào</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Khách #{activeSession.substring(activeSession.length - 4)}</h3>
                  <p className="text-xs text-green-600 font-medium">Đang trực tuyến</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div key={msg._id || idx} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-2.5 text-[14px] shadow-sm ${
                      msg.isAdmin 
                        ? 'bg-red-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-3 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn hỗ trợ..."
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-5 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-red-600 text-white rounded-xl px-6 font-bold flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  Gửi
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={64} className="mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-500">Chọn một cuộc trò chuyện để bắt đầu hỗ trợ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

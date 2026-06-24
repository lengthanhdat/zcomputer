"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Search, Activity, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info, Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";

interface LogEntry {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  entityDetails?: any;
  details?: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const limit = 20;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = `/logs?page=${page}&limit=${limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (actionFilter) query += `&action=${actionFilter}`;
      if (entityFilter) query += `&entity=${entityFilter}`;
      
      const res = await fetchApi(query);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Không thể tải nhật ký hoạt động");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, entityFilter]);

  // Prevent searching on every keystroke, use simple form submit or enter key
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1 w-max"><CheckCircle2 size={12}/> TẠO MỚI</span>;
      case 'UPDATE': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded flex items-center gap-1 w-max"><AlertTriangle size={12}/> CẬP NHẬT</span>;
      case 'DELETE': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded flex items-center gap-1 w-max"><XCircle size={12}/> XÓA</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded flex items-center gap-1 w-max"><Info size={12}/> {action}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }).format(d);
  };
  const renderObjectNode = (obj: any) => {
    if (!obj) return <span className="text-gray-400 italic">null</span>;
    if (typeof obj !== 'object') return <span className="text-gray-800 font-medium">{String(obj)}</span>;
    
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(obj).map(([key, value]) => {
          if(key.startsWith('_')) return null; // Skip private fields like _id, __v
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-start border-b border-gray-100/50 py-1.5 last:border-0">
              <span className="text-xs font-bold text-gray-500 w-32 shrink-0">{key}</span>
              <div className="text-sm overflow-hidden break-all">{
                typeof value === 'object' && value !== null 
                  ? <span className="text-gray-400 text-xs italic">{"{Object/Array}"}</span>
                  : <span className="text-gray-800">{String(value)}</span>
              }</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChanges = (action: string, details: any) => {
    if (!details) return <span className="text-gray-400 italic text-sm">Không có chi tiết</span>;
    
    if (action === 'UPDATE' && details.old && details.new) {
      const keys = new Set([...Object.keys(details.old || {}), ...Object.keys(details.new || {})]);
      const changedKeys = Array.from(keys).filter(key => {
        if(key.startsWith('_') || key === 'updatedAt' || key === 'createdAt') return false;
        return JSON.stringify(details.old?.[key]) !== JSON.stringify(details.new?.[key]);
      });
      
      if (changedKeys.length === 0) return <span className="text-gray-400 italic text-sm">Chỉ có thay đổi cập nhật thời gian hoặc hệ thống</span>;

      return (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border-b border-gray-200 font-bold text-gray-600 text-xs uppercase w-1/4">Trường</th>
                <th className="p-2 border-b border-gray-200 font-bold text-red-600 bg-red-50/50 text-xs uppercase w-3/8">Cũ</th>
                <th className="p-2 border-b border-gray-200 font-bold text-green-600 bg-green-50/50 text-xs uppercase w-3/8">Mới</th>
              </tr>
            </thead>
            <tbody>
              {changedKeys.map(key => (
                <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 font-mono text-[11px] text-gray-600 align-top">{key}</td>
                  <td className="p-2 text-red-700 bg-red-50/30 break-all text-xs align-top">
                    {typeof details.old?.[key] === 'object' ? JSON.stringify(details.old?.[key]) : String(details.old?.[key] ?? 'null')}
                  </td>
                  <td className="p-2 text-green-700 bg-green-50/30 break-all text-xs align-top">
                    {typeof details.new?.[key] === 'object' ? JSON.stringify(details.new?.[key]) : String(details.new?.[key] ?? 'null')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    return renderObjectNode(details);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-primary" /> Nhật ký hoạt động
          </h1>
          <p className="text-gray-500 text-sm mt-1">Giám sát mọi thay đổi, tác động lên hệ thống từ Admin và Staff</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-bold text-gray-500">Tổng số bản ghi: </span>
          <span className="text-lg font-black text-primary">{total.toLocaleString('vi-VN')}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Tìm theo tên / email nhân viên..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>

        <select 
          value={actionFilter} 
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-gray-600 bg-white min-w-[150px]"
        >
          <option value="">Tất cả Hành động</option>
          <option value="CREATE">Tạo mới (CREATE)</option>
          <option value="UPDATE">Cập nhật (UPDATE)</option>
          <option value="DELETE">Xóa (DELETE)</option>
        </select>

        <select 
          value={entityFilter} 
          onChange={e => { setEntityFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-gray-600 bg-white min-w-[150px]"
        >
          <option value="">Tất cả Đối tượng</option>
          <option value="Product">Sản phẩm</option>
          <option value="Order">Đơn hàng</option>
          <option value="User">Người dùng</option>
          <option value="Category">Danh mục</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Thời gian</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Nhân sự</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Hành động</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Đối tượng</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    Đang tải nhật ký...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Không tìm thấy bản ghi nào.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                          <CalendarIcon size={14} className="text-gray-400" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-bold text-sm text-gray-800">{log.userName}</div>
                        <div className="text-xs text-gray-500">{log.userEmail}</div>
                        <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${log.userRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {log.userRole}
                        </span>
                      </td>
                      <td className="p-4 align-top">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-sm font-bold text-gray-800">{log.entity}</div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">{log.entityId}</div>
                      </td>
                      <td className="p-4 align-top text-right">
                        <button 
                          onClick={() => setExpandedLogId(expandedLogId === log._id ? null : log._id)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded transition-colors"
                        >
                          Xem Data {expandedLogId === log._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Details Row */}
                    {expandedLogId === log._id && (
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <td colSpan={5} className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm overflow-x-auto h-full">
                              <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 pb-2 border-b flex items-center gap-2">
                                <Activity size={14} className="text-primary"/> Thay đổi (Changes)
                              </h4>
                              {renderChanges(log.action, log.details)}
                            </div>
                            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm overflow-x-auto h-full">
                              <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 pb-2 border-b flex items-center gap-2">
                                <Info size={14} className="text-blue-500"/> Chi tiết Đối tượng (Snapshot)
                              </h4>
                              {renderObjectNode(log.entityDetails)}
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-400 flex items-center gap-4 border-t pt-2">
                            <span><strong>IP:</strong> {log.ipAddress || 'N/A'}</span>
                            <span className="truncate"><strong>User Agent:</strong> {log.userAgent || 'N/A'}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-500 font-medium">Trang {page} / {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Trước
              </button>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

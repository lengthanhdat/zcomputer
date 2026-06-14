'use client';

import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';

interface CanAccessProps {
  permission: string;
  children: React.ReactNode;
}

export default function CanAccess({ permission, children }: CanAccessProps) {
  const { user } = useAuthStore();
  
  if (!user || !user.permissions) return null;
  
  // Hiển thị nếu user có quyền hoặc là admin
  if (!user.permissions.includes(permission) && user.role !== 'admin') return null;
  
  return <>{children}</>;
}

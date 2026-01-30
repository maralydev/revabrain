"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import { PublicHeader } from "./PublicHeader";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}

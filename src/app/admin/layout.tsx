import { AdminLayout } from "@/shared/components/layout/AdminLayout";
import { requireAuth } from "@/shared/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <AdminLayout>{children}</AdminLayout>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CRM | Portfolio Management",
  description: "Secure Admin Management System for Portfolio Projects and Content",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#08080c] text-slate-100 font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {children}
    </div>
  );
}

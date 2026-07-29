"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { AdminDashboard } from "@/features/admin/admin-dashboard";

export default function AdminPage() {
  const { session, hydrated } = useAuth();

  if (!hydrated) {
    return <div className="page-shell py-12 text-[#68736d]">Carregando área administrativa...</div>;
  }

  if (session?.user.role !== "ADMIN") {
    return (
      <section className="page-shell grid min-h-[60vh] place-items-center py-12">
        <div className="card max-w-lg rounded-[2rem] p-10 text-center">
          <ShieldAlert className="mx-auto text-[#ef7b45]" size={50} />
          <h1 className="mt-5 text-2xl font-black">Acesso exclusivo para administradores</h1>
          <p className="mt-2 text-[#68736d]">
            Entre com a conta administrativa para gerenciar o catálogo.
          </p>
          <Link href="/login" className="button-primary mt-6">Entrar como admin</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell py-10">
      <span className="eyebrow">Operação da loja</span>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.055em]">Painel administrativo</h1>
      <p className="mb-8 mt-3 max-w-2xl text-[#68736d]">
        Cadastre o catálogo, ajuste preços e programe campanhas. Os controles abaixo são protegidos
        também no backend.
      </p>
      <AdminDashboard token={session.accessToken} />
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { api } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await api.login({
        username: String(form.get("username") ?? ""),
        password: String(form.get("password") ?? "")
      });
      saveSession(response);
      router.push(response.user.role === "ADMIN" ? "/admin" : "/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell grid min-h-[calc(100vh-15rem)] place-items-center py-12">
      <div className="card grid w-full max-w-4xl overflow-hidden rounded-[2rem] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden bg-[#1e4d3a] p-8 text-white sm:p-10">
          <div className="absolute -bottom-16 -right-16 size-60 rounded-full border-[42px] border-[#b7e36d]/18" />
          <ShieldCheck className="text-[#b7e36d]" size={36} />
          <h1 className="mt-7 text-4xl font-black tracking-[-0.055em]">Que bom ter você de volta.</h1>
          <p className="mt-4 leading-7 text-white/70">
            A autenticação deste MVP é propositalmente simples: usuário, senha e um token de sessão.
          </p>
          <div className="relative mt-10 rounded-2xl border border-white/14 bg-white/8 p-4 text-sm text-white/75">
            <strong className="block text-white">Credenciais de estudo</strong>
            admin / admin123<br />
            cliente / cliente123
          </div>
        </div>
        <form onSubmit={submit} className="p-8 sm:p-10">
          <span className="eyebrow">Acesso</span>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Entrar na sua conta</h2>
          <div className="mt-8 grid gap-5">
            <label className="label">
              Usuário
              <input name="username" className="field" autoComplete="username" required />
            </label>
            <label className="label">
              Senha
              <input
                name="password"
                className="field"
                type="password"
                autoComplete="current-password"
                minLength={6}
                required
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-[#ef7b45]/10 p-3 text-sm font-semibold text-[#a83f25]" role="alert">
              {error}
            </p>
          )}
          <button className="button-primary mt-6 w-full" type="submit" disabled={loading}>
            <KeyRound size={18} />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}

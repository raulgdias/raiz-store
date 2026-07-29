"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api/client";
import { AdminFormShell } from "./admin-form-shell";

interface FormProps {
  token: string;
  onSaved(message: string): Promise<void>;
  onError(message: string): void;
}

export function CategoryForm({ token, onSaved, onError }: Readonly<FormProps>) {
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    try {
      await api.createCategory({ name: String(data.get("name") ?? "") }, token);
      form.reset();
      await onSaved("Categoria criada com sucesso.");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell title="Nova categoria" description="Organize o catálogo em grupos fáceis de filtrar.">
      <form onSubmit={submit} className="grid gap-4">
        <label className="label">
          Nome
          <input className="field" name="name" placeholder="Ex.: Escritório" minLength={2} required />
        </label>
        <button className="button-primary" disabled={loading} type="submit">
          {loading ? "Salvando..." : "Adicionar categoria"}
        </button>
      </form>
    </AdminFormShell>
  );
}

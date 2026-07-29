interface AdminFormShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AdminFormShell({ title, description, children }: Readonly<AdminFormShellProps>) {
  return (
    <section className="card rounded-[1.5rem] p-6">
      <h2 className="text-xl font-black tracking-[-0.035em]">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-[#68736d]">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

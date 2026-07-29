import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "RaizStore",
    template: "%s · RaizStore"
  },
  description: "Um e-commerce educacional construído com Next.js, NestJS, DDD e CQRS."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <footer className="mt-20 border-t border-black/8 py-10">
            <div className="page-shell flex flex-col justify-between gap-2 text-sm text-[#68736d] sm:flex-row">
              <span>RaizStore · um laboratório de e-commerce</span>
              <span>Next.js + NestJS + PostgreSQL</span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, Home, LineChart, User } from "lucide-react";
import { HeaderWash } from "./Art";

const nav = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/diario", label: "Diário", icon: BookOpen },
  { to: "/humor", label: "Humor", icon: LineChart },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  wash = true,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  wash?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background pb-28">
      {wash && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-52 overflow-hidden">
          <HeaderWash className="h-full w-full opacity-70 blur-2xl" />
        </div>
      )}
      <main className="relative mx-auto w-full max-w-2xl px-5 pt-10">
        {title && (
          <header className="fade-up mb-7">
            <h1 className="text-3xl leading-tight text-foreground sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </header>
        )}
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-card/85 backdrop-blur-md">
        <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-3 py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent/60"
                activeProps={{ className: "text-primary bg-accent/70" }}
              >
                <Icon className="size-5" strokeWidth={1.6} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

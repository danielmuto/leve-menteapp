import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ExerciseArt } from "@/components/Art";
import { exercises, getExercise } from "@/lib/exercises";
import { useApp, type Entry } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportEntriesToPdf } from "@/lib/pdf";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Meu diário — Escrita Terapêutica" },
      {
        name: "description",
        content: "Releia o que você escreveu, filtre por exercício e período e exporte em PDF.",
      },
      { property: "og:title", content: "Meu diário — Escrita Terapêutica" },
      { property: "og:description", content: "Todo o seu percurso de escrita, em um lugar só." },
    ],
  }),
  component: Journal,
});

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

function preview(entry: Entry) {
  return Object.values(entry.values).filter(Boolean).join(" · ").slice(0, 180);
}

function Journal() {
  const { state, visibleEntries, removeEntry } = useApp();
  const [slug, setSlug] = useState("todos");
  const [periodo, setPeriodo] = useState("todos");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const days = periodo === "7" ? 7 : periodo === "30" ? 30 : null;
    const limit = days ? Date.now() - days * 86400000 : null;
    return visibleEntries.filter(
      (e) =>
        (slug === "todos" || e.slug === slug) &&
        (!limit || new Date(e.createdAt).getTime() >= limit),
    );
  }, [visibleEntries, slug, periodo]);

  function handleExport() {
    if (!state.subscriber) return;
    exportEntriesToPdf(filtered, state.name);
    toast.success("PDF gerado. Leve para a sua próxima sessão.");
  }

  return (
    <AppShell title="Meu diário" subtitle="Tudo o que você escreveu, no seu ritmo.">
      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={slug} onValueChange={setSlug}>
          <SelectTrigger className="h-11 min-w-[190px] rounded-full bg-card">
            <SelectValue placeholder="Exercício" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os exercícios</SelectItem>
            {exercises.map((e) => (
              <SelectItem key={e.slug} value={e.slug}>
                {e.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="h-11 min-w-[150px] rounded-full bg-card">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo o período</SelectItem>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>

        {state.subscriber ? (
          <Button variant="secondary" className="h-11 rounded-full" onClick={handleExport}>
            <Download className="mr-1 size-4" /> Exportar em PDF
          </Button>
        ) : (
          <Button asChild variant="secondary" className="h-11 rounded-full">
            <Link to="/assinatura">
              <Lock className="mr-1 size-3" /> Exportar em PDF
            </Link>
          </Button>
        )}
      </div>

      {!state.subscriber && (
        <p className="mb-6 rounded-2xl border border-mauve/25 bg-mauve-soft/30 p-4 text-sm">
          Seu histórico gratuito mostra os últimos 30 dias.{" "}
          <Link to="/assinatura" className="font-medium underline underline-offset-4">
            Com a assinatura ele fica completo
          </Link>
          , sem limite de tempo.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <ExerciseArt kind="list" size={80} className="mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Nada por aqui ainda. Quando você escrever, tudo aparece neste lugar.
          </p>
          <Button asChild className="mt-5 min-h-11 rounded-full">
            <Link to="/inicio">Escolher um exercício</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((entry) => {
            const ex = getExercise(entry.slug);
            const isOpen = open === entry.id;
            return (
              <li
                key={entry.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-soft paper"
              >
                <button
                  className="flex w-full items-start gap-4 text-left"
                  onClick={() => setOpen(isOpen ? null : entry.id)}
                >
                  <ExerciseArt kind={ex?.art ?? "list"} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {fmt.format(new Date(entry.createdAt))}
                    </p>
                    <p className="font-medium leading-snug">{entry.title}</p>
                    {!isOpen && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {preview(entry)}
                      </p>
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-4 space-y-4">
                    {ex?.fields.map((f) =>
                      entry.values[f.key]?.trim() ? (
                        <div key={f.key}>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {f.label}
                          </p>
                          <p className="journal-text whitespace-pre-wrap">{entry.values[f.key]}</p>
                        </div>
                      ) : null,
                    )}
                    {entry.audios?.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Áudios
                        </p>
                        {entry.audios.map((a) => (
                          <audio key={a.id} controls src={a.url} className="h-10 w-full max-w-sm" />
                        ))}
                      </div>
                    ) : null}
                    <button
                      onClick={() => {
                        removeEntry(entry.id);
                        toast("Registro apagado.");
                      }}
                      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" /> Apagar este registro
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}

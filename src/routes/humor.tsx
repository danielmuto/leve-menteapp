import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MoodIcon } from "@/components/Art";
import { moodInfo, moods } from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/humor")({
  head: () => ({
    meta: [
      { title: "Estatísticas de humor — Escrita Terapêutica" },
      {
        name: "description",
        content: "Acompanhe a evolução do seu humor por semana e por mês, com um resumo gentil.",
      },
      { property: "og:title", content: "Estatísticas de humor — Escrita Terapêutica" },
      { property: "og:description", content: "Veja padrões do seu humor ao longo do tempo." },
    ],
  }),
  component: MoodStats,
});

const weekLabels = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function MoodStats() {
  const { state } = useApp();
  const logs = state.moodLogs;

  const lastWeek = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const mood = logs.find((l) => l.date === key)?.mood;
      return { key, day: weekLabels[d.getDay()]!, mood, score: mood ? (moodInfo(mood)?.score ?? 0) : 0 };
    });
  }, [logs]);

  const month = useMemo(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return {
      pad: first.getDay(),
      days: Array.from({ length: total }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate(),
        ).padStart(2, "0")}`;
        return { n: i + 1, mood: logs.find((l) => l.date === key)?.mood };
      }),
    };
  }, [logs]);

  const summary = useMemo(() => {
    if (logs.length < 3) return "Registre seu humor por alguns dias e um resumo aparece aqui.";
    const scores = logs.map((l) => moodInfo(l.mood)?.score ?? 3);
    const recent = scores.slice(-7);
    const before = scores.slice(-14, -7);
    const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
    const byWeekday: Record<number, number[]> = {};
    logs.forEach((l) => {
      const wd = new Date(l.date + "T12:00:00").getDay();
      (byWeekday[wd] ??= []).push(moodInfo(l.mood)?.score ?? 3);
    });
    const worst = Object.entries(byWeekday).sort((a, b) => avg(a[1]) - avg(b[1]))[0];
    const trend =
      before.length && avg(recent) > avg(before)
        ? "Você tem se sentido mais leve nas últimas semanas."
        : before.length && avg(recent) < avg(before)
          ? "As últimas semanas pesaram um pouco mais. Vale ir com calma."
          : "Seu humor tem se mantido estável.";
    const weekday = worst
      ? ` Seus dias mais difíceis costumam cair em ${["domingos", "segundas-feiras", "terças-feiras", "quartas-feiras", "quintas-feiras", "sextas-feiras", "sábados"][Number(worst[0])]}.`
      : "";
    return trend + weekday;
  }, [logs]);

  const content = (
    <>
      <section className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl">Sua semana</h2>
        <div className="mt-6 flex h-44 items-end justify-between gap-3">
          {lastWeek.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-xl transition-all"
                style={{
                  height: `${Math.max(d.score * 20, 6)}%`,
                  backgroundColor: d.mood ? (moodInfo(d.mood)?.color ?? "var(--primary)") : "var(--border)",
                  opacity: d.mood ? 0.85 : 1,
                }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl">Seu mês</h2>
        <div className="mt-5 grid grid-cols-7 gap-2">
          {weekLabels.map((w) => (
            <span key={w} className="text-center text-xs text-muted-foreground">
              {w}
            </span>
          ))}
          {Array.from({ length: month.pad }).map((_, i) => (
            <span key={`p${i}`} />
          ))}
          {month.days.map((d) => (
            <div
              key={d.n}
              className="flex aspect-square items-center justify-center rounded-xl text-xs"
              style={{
                backgroundColor: d.mood
                  ? `color-mix(in oklab, ${moodInfo(d.mood)?.color} 40%, var(--card))`
                  : "var(--muted)",
              }}
              title={d.mood ?? ""}
            >
              {d.n}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {moods.map((m) => (
            <span key={m.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: m.color, opacity: 0.6 }}
              />
              {m.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-mauve/25 bg-mauve-soft/35 p-6">
        <h2 className="text-lg">O que os seus registros contam</h2>
        <p className="mt-2 text-muted-foreground">{summary}</p>
      </section>
    </>
  );

  return (
    <AppShell title="Seu humor" subtitle="Padrões que só aparecem quando a gente observa com calma.">
      {state.subscriber ? (
        content
      ) : (
        <div className="relative">
          <div className="pointer-events-none select-none blur-[6px] saturate-75" aria-hidden="true">
            {content}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-background/40">
            <div className="mx-4 max-w-sm rounded-3xl border border-mauve/30 bg-card p-7 text-center shadow-lift">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-mauve-soft">
                <Lock className="size-5 text-mauve" />
              </div>
              <h2 className="text-2xl">Estatísticas completas</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Gráfico semanal, calendário de humor e um resumo gentil do seu percurso — parte da
                assinatura.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                {moods.slice(0, 4).map((m) => (
                  <MoodIcon key={m.key} mood={m.key} size={26} />
                ))}
              </div>
              <Button asChild size="lg" className="mt-5 min-h-12 w-full rounded-full">
                <Link to="/assinatura">Ver a assinatura</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

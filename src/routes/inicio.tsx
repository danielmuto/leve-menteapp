import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BookOpen, Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseArt, MoodIcon, StreakTrail } from "@/components/Art";
import { SupportNote } from "@/components/SupportNote";
import {
  exercises,
  freeExercises,
  moods,
  moodLabel,
  premiumExercises,
  thanksMessage,
} from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Seu dia — Escrita Terapêutica" },
      {
        name: "description",
        content: "Registre seu humor, veja o exercício sugerido para hoje e escreva em dois toques.",
      },
      { property: "og:title", content: "Seu dia — Escrita Terapêutica" },
      { property: "og:description", content: "Exercício sugerido, streak e diário em um só lugar." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 19) return "Boa tarde";
  return "Boa noite";
}

function Dashboard() {
  const navigate = useNavigate();
  const { state, hydrated, todayMood, logMood, streak, visibleEntries } = useApp();

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/comecar" });
  }, [hydrated, state.onboarded, navigate]);

  const mood = todayMood ?? state.defaultMood;
  const suggested =
    exercises.find((e) => e.free && e.moods.includes(mood)) ?? freeExercises[0]!;

  return (
    <AppShell>
      <section className="fade-up mb-8">
        <p className="text-sm text-muted-foreground">{greeting()},</p>
        <h1 className="text-3xl sm:text-4xl">{state.name || "que bom te ver"}</h1>
      </section>

      <section className="fade-up mb-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <p className="text-sm font-medium">Como você está hoje?</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                logMood(m.key);
                toast.success(thanksMessage(state.pronoun));
              }}
              className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all ${
                mood === m.key
                  ? "border-primary bg-primary-soft/50"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              <MoodIcon mood={m.key} size={24} active={mood === m.key} />
              {moodLabel(m.key, state.pronoun)}
            </button>
          ))}
        </div>
      </section>

      <section className="fade-up mb-6 overflow-hidden rounded-3xl border border-primary/25 bg-primary-soft/40 shadow-lift">
        <div className="flex items-start gap-4 p-6">
          <ExerciseArt kind={suggested.art} size={76} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Sugerido para hoje
            </p>
            <h2 className="mt-1 text-2xl leading-tight">{suggested.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {suggested.tagline} · {suggested.minutes} min
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <Button asChild size="lg" className="min-h-12 w-full rounded-full">
            <Link to="/exercicio/$slug" params={{ slug: suggested.slug }}>
              Começar a escrever <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="fade-up mb-8 flex items-center gap-4 rounded-3xl border border-border bg-card p-5 paper">
        <div>
          <p className="text-sm text-muted-foreground">Sua trilha</p>
          <p className="text-xl whitespace-nowrap">
            {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
          </p>
        </div>
        <div className="ml-auto">
          <StreakTrail days={streak} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl">Sempre gratuitos</h2>
        <ul className="space-y-3">
          {freeExercises.map((e) => (
            <li key={e.slug}>
              <Link
                to="/exercicio/$slug"
                params={{ slug: e.slug }}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <ExerciseArt kind={e.art} size={56} />
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{e.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.tagline} · {e.minutes} min
                  </p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-1 text-xl">Do método completo</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {state.subscriber
            ? "Todos liberados na sua assinatura."
            : "Disponíveis para assinantes, quando você quiser."}
        </p>
        <ul className="space-y-3">
          {premiumExercises.map((e) => (
            <li key={e.slug}>
              <Link
                to="/exercicio/$slug"
                params={{ slug: e.slug }}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card/70 p-4 transition-transform hover:-translate-y-0.5"
              >
                <ExerciseArt kind={e.art} size={56} className="opacity-90" />
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{e.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.tagline} · {e.minutes} min
                  </p>
                </div>
                {!state.subscriber && (
                  <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-mauve-soft px-3 py-1 text-xs font-medium text-foreground/80">
                    <Lock className="size-3" /> Assinante
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/diario"
          className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft"
        >
          <BookOpen className="size-5 text-primary" strokeWidth={1.6} />
          <div>
            <p className="font-medium">Meu diário</p>
            <p className="text-sm text-muted-foreground">
              {visibleEntries.length} {visibleEntries.length === 1 ? "registro" : "registros"}
            </p>
          </div>
        </Link>
        <Link
          to="/humor"
          className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft"
        >
          <Sparkles className="size-5 text-mauve" strokeWidth={1.6} />
          <div>
            <p className="font-medium">Meu humor</p>
            <p className="text-sm text-muted-foreground">
              {state.subscriber ? "Semana e mês completos" : "Prévia da sua semana"}
            </p>
          </div>
        </Link>
      </section>

      <div className="mt-6">
        <SupportNote />
      </div>
    </AppShell>
  );
}

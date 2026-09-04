import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lock, Pause, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AudioMemo, type AudioNote } from "@/components/AudioMemo";
import { VoiceInput } from "@/components/VoiceInput";
import { ExerciseArt } from "@/components/Art";
import { SupportNote } from "@/components/SupportNote";
import { getExercise } from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/exercicio/$slug")({
  head: ({ params }) => {
    const ex = getExercise(params.slug);
    const title = ex ? `${ex.title} — Escrita Terapêutica` : "Exercício — Escrita Terapêutica";
    const description = ex?.intro ?? "Exercício de escrita terapêutica.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  component: ExercisePage,
});

function ExercisePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { state, addEntry } = useApp();
  const exercise = getExercise(slug);
  const [values, setValues] = useState<Record<string, string>>({});
  const [audios, setAudios] = useState<AudioNote[]>([]);
  const [done, setDone] = useState(false);

  if (!exercise) {
    return (
      <AppShell title="Exercício não encontrado">
        <Button asChild className="rounded-full">
          <Link to="/inicio">Voltar ao início</Link>
        </Button>
      </AppShell>
    );
  }

  const locked = !exercise.free && !state.subscriber;

  if (locked) {
    return (
      <AppShell>
        <div className="fade-up space-y-6 text-center">
          <ExerciseArt kind={exercise.art} size={110} className="mx-auto" />
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-mauve-soft px-3 py-1 text-xs font-medium">
              <Lock className="size-3" /> Exercício de assinante
            </span>
            <h1 className="text-3xl">{exercise.title}</h1>
            <p className="mx-auto max-w-md text-muted-foreground">{exercise.intro}</p>
          </div>
          <div className="space-y-3">
            <Button asChild size="lg" className="min-h-12 w-full rounded-full">
              <Link to="/assinatura">Conhecer a assinatura</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Enquanto isso, os 4 exercícios gratuitos continuam inteiros para você.
            </p>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/inicio">Voltar aos gratuitos</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  function save() {
    const filled = Object.values(values).some((v) => v.trim().length > 0);
    if (!filled && audios.length === 0) {
      toast("Escreva, dite ou grave ao menos uma coisinha.");
      return;
    }
    addEntry({ slug: exercise!.slug, title: exercise!.title, values, audios });
    setDone(true);
  }

  if (done) {
    return (
      <AppShell>
        <div className="fade-up space-y-6 rounded-3xl border border-success/30 bg-success-soft/40 p-8 text-center">
          <Sparkles className="mx-auto size-8 text-success" strokeWidth={1.5} />
          <h1 className="text-3xl">Salvo no seu diário</h1>
          <p className="mx-auto max-w-md text-muted-foreground">{exercise.closing}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-12 rounded-full">
              <Link to="/diario">Ver meu diário</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12 rounded-full">
              <Link to="/inicio">Voltar ao início</Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 text-left">
          <SupportNote compact />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button
        onClick={() => navigate({ to: "/inicio" })}
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Início
      </button>

      <header className="fade-up mb-7 flex items-start gap-4">
        <ExerciseArt kind={exercise.art} size={84} />
        <div>
          <h1 className="text-3xl leading-tight">{exercise.title}</h1>
          <p className="mt-2 text-muted-foreground">{exercise.intro}</p>
        </div>
      </header>

      {exercise.timer && <FlowTimer />}

      <div className="space-y-5">
        {exercise.fields.map((f) => (
          <div key={f.key} className="rounded-3xl border border-border bg-card p-5 shadow-soft paper">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor={f.key} className="text-sm font-medium">
                {f.label}
              </label>
              <VoiceInput
                onText={(text) =>
                  setValues((v) => ({
                    ...v,
                    [f.key]: `${(v[f.key] ?? "").trimEnd()} ${text}`.trim(),
                  }))
                }
              />
            </div>
            <Textarea
              id={f.key}
              rows={f.rows ?? 5}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="journal-text mt-3 resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <AudioMemo notes={audios} onChange={setAudios} />
      </div>

      <Button size="lg" className="mt-7 min-h-12 w-full rounded-full" onClick={save}>
        Salvar no meu diário
      </Button>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Ninguém além de você lê o que está aqui.
      </p>
    </AppShell>
  );
}

function FlowTimer() {
  const [minutes, setMinutes] = useState(5);
  const [left, setLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false);
          toast.success("Tempo encerrado. Você escreveu sem parar — isso é muito.");
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-3xl border border-mauve/25 bg-mauve-soft/40 p-5">
      <div>
        <p className="text-sm text-muted-foreground">Seu tempo</p>
        <p className="font-display text-3xl tabular-nums">
          {mm}:{ss}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[3, 5, 10, 15].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMinutes(m);
              setLeft(m * 60);
              setRunning(false);
            }}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
              minutes === m ? "border-mauve bg-card" : "border-border hover:bg-card/70"
            }`}
          >
            {m} min
          </button>
        ))}
      </div>
      <Button
        variant="secondary"
        className="ml-auto min-h-11 rounded-full"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? <Pause className="mr-1 size-4" /> : <Play className="mr-1 size-4" />}
        {running ? "Pausar" : "Começar"}
      </Button>
    </div>
  );
}

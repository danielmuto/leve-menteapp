import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Quote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ExerciseArt } from "@/components/Art";
import { premiumExercises } from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assinatura")({
  head: () => ({
    meta: [
      { title: "Assinatura — Escrita Terapêutica" },
      {
        name: "description",
        content:
          "Todos os exercícios do método, estatísticas completas, exportação em PDF e histórico ilimitado por R$ 39,90/mês.",
      },
      { property: "og:title", content: "Assinatura — Escrita Terapêutica" },
      {
        property: "og:description",
        content: "Menos que uma sessão de terapia, todos os dias com você.",
      },
    ],
  }),
  component: Paywall,
});

const beneficios = [
  "Todos os exercícios do método, sem bloqueios",
  "Estatísticas de humor semanais e mensais",
  "Exportação do diário em PDF para levar à terapia",
  "Histórico completo, sem limite de tempo",
];

function Paywall() {
  const { state, update } = useApp();
  const navigate = useNavigate();

  function subscribe() {
    // Checkout do Stripe entra aqui assim que as chaves forem conectadas.
    update({ subscriber: true });
    toast.success("Assinatura ativada. Tudo liberado para você.");
    navigate({ to: "/inicio" });
  }

  if (state.subscriber) {
    return (
      <AppShell title="Você é assinante" subtitle="Todos os exercícios e recursos estão liberados.">
        <div className="rounded-3xl border border-success/30 bg-success-soft/40 p-7">
          <p className="text-muted-foreground">
            Sua assinatura está ativa. Você pode gerenciar pagamento e cancelamento no seu perfil,
            quando quiser — sem burocracia.
          </p>
          <Button asChild className="mt-5 min-h-12 rounded-full">
            <Link to="/perfil">Gerenciar assinatura</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell wash={false}>
      <div className="fade-up overflow-hidden rounded-[2rem] border border-mauve/30 bg-mauve-soft/40 shadow-lift">
        <div className="relative p-8">
          <div className="glow-warm pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mauve">
              Método completo
            </span>
            <h1 className="mt-4 text-4xl leading-tight">
              Continue escrevendo,
              <br /> com tudo à sua disposição
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Os 4 exercícios gratuitos continuam seus para sempre. A assinatura abre o restante do
              método — para quando você quiser ir mais fundo.
            </p>

            <ul className="mt-7 space-y-3">
              {beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check className="size-3.5 text-success" />
                  </span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-3xl bg-card/90 p-6 text-center shadow-soft">
              <p className="font-display text-4xl">
                R$ 39,90
                <span className="font-sans text-base text-muted-foreground">/mês</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Menos que uma sessão de terapia — todos os dias com você.
              </p>
              <Button size="lg" className="mt-5 min-h-12 w-full rounded-full" onClick={subscribe}>
                Assinar agora
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Pagamento seguro · cancele quando quiser
              </p>
            </div>

            <figure className="mt-6 rounded-3xl border border-border bg-card/70 p-5">
              <Quote className="size-5 text-mauve" />
              <blockquote className="journal-text mt-2 text-sm">
                “Comecei escrevendo cinco minutos por dia. Em três semanas, eu conseguia perceber a
                ansiedade chegando antes dela tomar conta.”
              </blockquote>
              <figcaption className="mt-2 text-xs text-muted-foreground">
                Marina, 34 anos · usuária há 6 meses
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xl">O que se abre com a assinatura</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {premiumExercises.map((e) => (
            <li key={e.slug} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
              <ExerciseArt kind={e.art} size={48} />
              <div>
                <p className="text-sm font-medium leading-snug">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.tagline}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prefere continuar só com os gratuitos?{" "}
        <Link to="/inicio" className="underline underline-offset-4">
          Tudo bem, eles são seus
        </Link>
        .
      </p>
    </AppShell>
  );
}

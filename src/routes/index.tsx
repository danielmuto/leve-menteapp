import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Instagram, ShieldCheck } from "lucide-react";
import { ExerciseArt, HeaderWash } from "@/components/Art";
import { freeExercises } from "@/lib/exercises";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroArt from "@/assets/hero-escrita.jpg";
import psicologaArt from "@/assets/psicologa.jpg";
import logoHorizontal from "@/assets/logo-horizontal.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Levemente — escrita guiada para aliviar a ansiedade" },
      {
        name: "description",
        content:
          "Escrita terapêutica guiada, criada por uma psicóloga clínica. Comece grátis com 4 exercícios, sem cartão de crédito.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Levemente — sua mente merece um lugar para respirar" },
      {
        property: "og:description",
        content: "Poucos minutos de escrita guiada por dia para a ansiedade ganhar contorno.",
      },
    ],
  }),
  component: Landing,
});

function Feather({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 5c0 7.5-5.2 12-11.5 12.5C7 18 6 19 5 21"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M19 5c-6 .4-10.4 3.6-11.5 12.5C13 17 17.6 12.6 19 5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M13 8.6c-2 1.6-3.6 4-4.3 7" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}


function Cta({
  children,
  note,
  variant = "default",
}: {
  children: React.ReactNode;
  note?: string;
  variant?: "default" | "light";
}) {
  return (
    <div className="space-y-2">
      <Button
        asChild
        size="lg"
        className={`min-h-14 w-full rounded-full px-8 text-base shadow-lift sm:w-auto ${
          variant === "light" ? "bg-card text-primary hover:bg-card/90" : ""
        }`}
      >
        <Link to="/comecar">
          {children} <ArrowRight className="ml-1 size-4" />
        </Link>
      </Button>
      {note && (
        <p className={`text-sm ${variant === "light" ? "opacity-80" : "text-muted-foreground"}`}>
          {note}
        </p>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 text-primary/50">
      <span className="h-px w-14 bg-border" />
      <Feather className="size-4" />
      <span className="h-px w-14 bg-border" />
    </div>
  );
}

const passos = [
  {
    art: "list" as const,
    title: "Escolha um exercício",
    text: "Um convite por vez, pensado para o que você está sentindo agora.",
  },
  {
    art: "letter" as const,
    title: "Escreva sem julgamento",
    text: "Sem certo nem errado. Você só precisa colocar em palavras.",
  },
  {
    art: "flow" as const,
    title: "Acompanhe sua evolução",
    text: "Seu diário guarda tudo e mostra como seu humor caminha.",
  },
];

const faq = [
  {
    q: "Preciso pagar para começar?",
    a: "Não. O cadastro é gratuito e quatro exercícios são sempre livres, sem cartão de crédito.",
  },
  {
    q: "Isso substitui terapia?",
    a: "Não substitui. É um apoio diário entre as sessões — e pode ser um bom começo se você ainda não faz terapia.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "O que você escreve é privado e visível só para você. Nada é compartilhado com terceiros.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. A assinatura é mensal, sem fidelidade, e você cancela em dois toques no seu perfil.",
  },
  {
    q: "Quanto tempo leva por dia?",
    a: "De 3 a 10 minutos. O suficiente para a mente desacelerar sem virar mais uma cobrança na sua lista.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <span className="flex items-center">
            <img
              src={logoHorizontal.url}
              width={928}
              height={246}
              alt="Levemente"
              className="h-8 w-auto mix-blend-multiply"
            />
          </span>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/entrar">Entrar</Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px]">
          <HeaderWash className="h-full w-full blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 sm:py-20 lg:grid-cols-2">
          <div className="fade-up space-y-6">
            <h1 className="text-4xl leading-[1.1] sm:text-5xl">
              Sua mente merece um lugar para respirar
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Escrita guiada, poucos minutos por dia, para a ansiedade sair da sua cabeça e ganhar
              contorno no papel.
            </p>
            <Cta note="É grátis, sem cartão de crédito.">Quero começar a me sentir mais leve</Cta>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Feather className="size-4 text-primary" />
              Criado por uma psicóloga clínica
            </p>
          </div>
          <img
            src={heroArt}
            width={1280}
            height={960}
            alt="Ilustração em aquarela de mãos escrevendo em um caderno sob a luz da manhã"
            className="rounded-4xl shadow-lift"
          />
        </div>
      </section>

      {/* DOR */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <Divider />
        <h2 className="text-3xl">Talvez você reconheça isso</h2>
        <ul className="mt-8 space-y-4 text-lg text-muted-foreground">
          <li>A mente acelera justo quando você deita para dormir.</li>
          <li>Você sente muita coisa, mas não consegue colocar em palavras.</li>
          <li>Passa o dia apagando incêndios emocionais e nunca sobra tempo para você.</li>
          <li>Quando alguém pergunta como você está, a resposta automática é "tudo bem".</li>
        </ul>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl">Como funciona</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {passos.map((p, i) => (
              <div
                key={p.title}
                className="paper rounded-3xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <ExerciseArt kind={p.art} size={72} className="mx-auto" />
                <p className="mt-4 text-sm text-primary">Passo {i + 1}</p>
                <h3 className="mt-1 text-xl">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXERCÍCIOS GRÁTIS */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="text-center">
          <h2 className="text-3xl">Quatro exercícios, sempre gratuitos</h2>
          <p className="mt-3 text-muted-foreground">
            Você já pode ver o que vai encontrar do outro lado.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {freeExercises.map((e) => (
            <li
              key={e.slug}
              className="paper flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <ExerciseArt kind={e.art} size={56} />
              <div className="min-w-0">
                <p className="font-medium leading-snug">{e.title}</p>
                <p className="text-sm text-muted-foreground">{e.tagline}</p>
              </div>
              <Check className="ml-auto size-5 shrink-0 text-success" />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Cta note="Leva menos de 2 minutos para começar.">Escreva o que sente, sem pagar nada</Cta>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-8 px-5 sm:grid-cols-[260px_1fr]">
          <img
            src={psicologaArt}
            width={900}
            height={1100}
            loading="lazy"
            alt="Ilustração em aquarela da psicóloga criadora do método"
            className="rounded-4xl shadow-soft"
          />
          <div className="space-y-4">
            <Feather className="size-6 text-primary" />
            <h2 className="text-3xl">Quem escreveu os exercícios</h2>
            <p className="text-muted-foreground">
              Sou psicóloga clínica e atendo, todos os dias, pessoas que convivem com ansiedade.
            </p>
            <p className="text-muted-foreground">
              Os exercícios daqui nasceram do consultório: são as perguntas que mais ajudaram meus
              pacientes a organizar o pensamento entre uma sessão e outra.
            </p>
            <p className="text-muted-foreground">
              Nada de linguagem clínica. Só um caminho gentil para você se ouvir.
            </p>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl">Quem já começou</h2>
        <p className="mt-3 text-center text-muted-foreground">
          +1.200 pessoas já começaram sua jornada de escrita
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <figure
              key={i}
              className="paper rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <Feather className="size-5 text-primary/70" />
              <blockquote className="journal-text mt-3 text-muted-foreground">
                [espaço reservado para depoimento]
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— Nome, cidade</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ASSINATURA */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <div className="rounded-4xl border border-mauve-soft bg-mauve-soft/50 p-8 text-center">
          <h2 className="text-2xl">E quando você quiser ir além</h2>
          <p className="mt-3 text-muted-foreground">
            Por R$ 39,90/mês você desbloqueia estatísticas de humor, exercícios extras e exportação
            em PDF para levar à terapia. Só quando fizer sentido para você.
          </p>
          <div className="mt-6 flex justify-center">
            <Cta>Comece grátis e desbloqueie mais quando quiser</Cta>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-5 pb-16">
        <h2 className="text-center text-3xl">Perguntas que costumam aparecer</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faq.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <Feather className="mx-auto size-8" />
          <h2 className="mt-6 text-4xl leading-tight">
            Hoje pode ser o dia em que você se escuta
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Uma página em branco esperando por você — e ninguém julgando o que vai sair.
          </p>
          <div className="mt-8 flex justify-center">
            <Cta variant="light" note="Leva menos de 2 minutos para começar.">
              Dê o primeiro passo, é gratuito
            </Cta>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-4xl space-y-4 px-5 py-12 text-sm text-muted-foreground">
        <p className="flex items-center">
          <img
            src={logoHorizontal.url}
            width={928}
            height={246}
            loading="lazy"
            alt="Levemente"
            className="h-7 w-auto mix-blend-multiply"
          />
        </p>
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Este é um apoio à sua saúde emocional e não substitui acompanhamento profissional. Em
          momentos de crise, ligue para o CVV (188), 24h por dia.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacidade" className="underline-offset-4 hover:underline">
            Política de privacidade
          </Link>
          <Link to="/termos" className="underline-offset-4 hover:underline">
            Termos de uso
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <Instagram className="size-4" /> Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bell, Check } from "lucide-react";
import { HeaderWash, MoodIcon, ExerciseArt } from "@/components/Art";
import { AvatarPicker } from "@/components/AvatarPicker";
import { moods, freeExercises, moodLabel } from "@/lib/exercises";
import logoVertical from "@/assets/logo-vertical.png.asset.json";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/comecar")({
  head: () => ({
    meta: [
      { title: "Criar sua conta — Levemente" },
      {
        name: "description",
        content:
          "Comece grátis no Levemente: diário guiado criado por psicóloga clínica, com 4 exercícios sempre gratuitos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Criar sua conta — Levemente" },
      {
        property: "og:description",
        content: "Quatro exercícios gratuitos para começar hoje. Sem julgamentos, no seu ritmo.",
      },

    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const { state, hydrated, update, logMood } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mood, setMood] = useState<string>("calma");
  const [reminder, setReminder] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [intention, setIntention] = useState("");

  useEffect(() => {
    if (hydrated && state.onboarded) navigate({ to: "/inicio" });
  }, [hydrated, state.onboarded, navigate]);

  function finish() {
    update({
      name: name.trim() || "você",
      defaultMood: mood,
      reminder,
      avatar,
      email: email.trim() || null,
      intention: intention.trim(),
      onboarded: true,
    });
    logMood(mood);
    navigate({ to: "/entrar" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]">
        <HeaderWash className="h-full w-full blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-14">
        {step === 0 && (
          <section className="fade-up space-y-7 text-center">
            <img
              src={logoVertical.url}
              width={905}
              height={574}
              alt="Levemente — pena em aquarela"
              className="mx-auto w-44 mix-blend-multiply drop-shadow-sm"
            />
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight sm:text-5xl">
                Escrever é um jeito gentil de se ouvir
              </h1>
              <p className="mx-auto max-w-md text-lg text-muted-foreground">
                Um diário guiado com exercícios criados por uma psicóloga clínica, para você
                atravessar a ansiedade no seu tempo — sem cobrança, sem julgamento.
              </p>
            </div>
            <Button size="lg" className="min-h-12 rounded-full px-8" onClick={() => setStep(1)}>
              Começar <ArrowRight className="ml-1 size-4" />
            </Button>
          </section>
        )}

        {step === 1 && (
          <section className="fade-up space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl">Como podemos te chamar?</h1>
              <p className="text-muted-foreground">Só isso. Nada de formulário longo.</p>
            </div>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="h-14 rounded-2xl bg-card text-lg"
            />
            <div className="space-y-3">
              <p className="text-sm font-medium">E como você está agora?</p>
              <div className="grid grid-cols-3 gap-3">
                {moods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={`flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-sm transition-all ${
                      mood === m.key
                        ? "border-primary bg-primary-soft/50 shadow-soft"
                        : "border-border bg-card hover:bg-accent/50"
                    }`}
                  >
                    <MoodIcon mood={m.key} active={mood === m.key} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => setStep(2)}>
              Continuar
            </Button>
          </section>
        )}

        {step === 2 && (
          <section className="fade-up space-y-7">
            <div className="space-y-2">
              <h1 className="text-3xl">Um cadastro bem pequeno</h1>
              <p className="text-muted-foreground">
                Tudo opcional e guardado no seu dispositivo. Serve só para o app te acolher pelo
                nome.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <AvatarPicker value={avatar} name={name} onChange={setAvatar} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail (para recuperar seu acesso)
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-14 rounded-2xl bg-card text-lg"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="intencao" className="text-sm font-medium">
                O que te trouxe até aqui?
              </label>
              <Input
                id="intencao"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ex.: entender minha ansiedade"
                className="h-14 rounded-2xl bg-card text-lg"
              />
            </div>
            <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => setStep(3)}>
              Continuar
            </Button>
          </section>
        )}

        {step === 3 && (
          <section className="fade-up space-y-7">
            <ExerciseArt kind="flow" size={100} />
            <div className="space-y-3">
              <h1 className="text-3xl">Um compromisso de 21 dias</h1>
              <p className="text-muted-foreground">
                Não é uma meta para cobrar de você. É um convite: alguns minutos por dia, o
                suficiente para a escrita virar hábito e a ansiedade ganhar contorno.
              </p>
            </div>
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex items-center gap-3 text-sm">
                <Bell className="size-5 text-primary" strokeWidth={1.6} />
                Quero um lembrete diário, à noite
              </span>
              <Switch checked={reminder} onCheckedChange={setReminder} />
            </label>
            <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => setStep(4)}>
              Aceito o convite
            </Button>
          </section>
        )}

        {step === 4 && (
          <section className="fade-up space-y-7">
            <div className="space-y-3">
              <h1 className="text-3xl">4 exercícios gratuitos para começar hoje</h1>
              <p className="text-muted-foreground">
                Sempre livres, sem assinatura. Eles já trazem alívio real por si só.
              </p>
            </div>
            <ul className="space-y-3">
              {freeExercises.map((e) => (
                <li
                  key={e.slug}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <ExerciseArt kind={e.art} size={52} />
                  <div className="min-w-0">
                    <p className="font-medium leading-snug">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.tagline}</p>
                  </div>
                  <Check className="ml-auto size-5 shrink-0 text-success" />
                </li>
              ))}
            </ul>
            <Button size="lg" className="min-h-12 w-full rounded-full" onClick={finish}>
              Criar minha conta
            </Button>
          </section>
        )}

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="mx-auto mt-8 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Voltar
          </button>
        )}
      </main>
    </div>
  );
}

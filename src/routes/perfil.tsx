import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, HeartHandshake, LogOut, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MoodIcon } from "@/components/Art";
import { moods } from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil e configurações — Escrita Terapêutica" },
      {
        name: "description",
        content: "Ajuste seu nome, lembretes e assinatura, e leia nossa política de privacidade.",
      },
      { property: "og:title", content: "Perfil — Escrita Terapêutica" },
      { property: "og:description", content: "Suas preferências e sua assinatura, no seu controle." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { state, update, reset } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(state.name);

  useEffect(() => {
    setName(state.name);
  }, [state.name]);


  return (
    <AppShell title="Seu perfil" subtitle="Pequenos ajustes para o app caber na sua rotina.">
      <section className="mb-5 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-2">
          <Label htmlFor="nome">Como quer ser chamada</Label>
          <Input
            id="nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              update({ name: name.trim() });
              toast.success("Nome atualizado.");
            }}
            className="h-12 rounded-2xl"
          />
        </div>
        <div className="space-y-3">
          <Label>Estado emocional padrão</Label>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.key}
                onClick={() => update({ defaultMood: m.key })}
                className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-sm ${
                  state.defaultMood === m.key
                    ? "border-primary bg-primary-soft/50"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <MoodIcon mood={m.key} size={22} active={state.defaultMood === m.key} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-5 space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Lembrete diário</p>
            <p className="text-sm text-muted-foreground">Um convite gentil, no fim do dia.</p>
          </div>
          <Switch
            checked={state.reminder}
            onCheckedChange={(v) => update({ reminder: v })}
          />
        </div>
        {state.reminder && (
          <div className="space-y-2">
            <Label htmlFor="hora">Horário</Label>
            <Input
              id="hora"
              type="time"
              value={state.reminderTime}
              onChange={(e) => update({ reminderTime: e.target.value })}
              className="h-12 w-40 rounded-2xl"
            />
          </div>
        )}
      </section>

      <section className="mb-5 rounded-3xl border border-mauve/25 bg-mauve-soft/30 p-6">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 size-5 text-mauve" strokeWidth={1.6} />
          <div className="flex-1">
            <p className="font-medium">Assinatura</p>
            <p className="text-sm text-muted-foreground">
              {state.subscriber
                ? "Ativa · R$ 39,90/mês, renovação mensal"
                : "Você está no plano gratuito, com os 4 exercícios essenciais."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {state.subscriber ? (
                <>
                  <Button
                    variant="secondary"
                    className="min-h-11 rounded-full"
                    onClick={() => toast("Abrindo o portal de pagamento...")}
                  >
                    Atualizar pagamento
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-11 rounded-full"
                    onClick={() => {
                      update({ subscriber: false });
                      toast("Assinatura cancelada. Você continua com os exercícios gratuitos.");
                    }}
                  >
                    Cancelar assinatura
                  </Button>
                </>
              ) : (
                <Button asChild className="min-h-11 rounded-full">
                  <Link to="/assinatura">Conhecer a assinatura</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-3xl border border-border bg-card p-2 shadow-soft">
        <Accordion type="single" collapsible>
          <AccordionItem value="privacidade" className="border-0">
            <AccordionTrigger className="px-4 text-left">Política de privacidade</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-muted-foreground">
              O que você escreve é conteúdo emocional sensível e pertence só a você. Não vendemos,
              compartilhamos nem usamos seus textos para treinar sistemas. [Espaço reservado para o
              texto completo da política de privacidade elaborado pela equipe jurídica.]
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="mb-5">
        <SupportNote />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <HeartHandshake className="size-4" /> Feito com cuidado por uma psicóloga clínica
        </p>
        <Button
          variant="ghost"
          className="min-h-11 rounded-full text-muted-foreground"
          onClick={() => {
            reset();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-1 size-4" /> Sair
        </Button>
      </div>
    </AppShell>
  );
}

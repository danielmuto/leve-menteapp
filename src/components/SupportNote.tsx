import { MessageCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PSICOLOGA = {
  nome: "Vanessa Feil Homa",
  telefone: "5551997753389",
  telefoneVisivel: "(51) 99775-3389",
};

const MENSAGEM =
  "Olá, Vanessa! Cheguei até você pelo aplicativo Escrita Terapêutica. Tenho escrito sobre o que sinto e gostaria de conversar sobre um acompanhamento psicológico. Pode me contar como funciona?";

export const whatsappLink = () =>
  `https://wa.me/${PSICOLOGA.telefone}?text=${encodeURIComponent(MENSAGEM)}`;

export function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <Button
      asChild
      size="lg"
      className={`min-h-12 w-full rounded-full ${className}`}
    >
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-1 size-4" /> Falar com {PSICOLOGA.nome.split(" ")[0]} no WhatsApp
      </a>
    </Button>
  );
}

export function SupportNote({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-3xl border border-border bg-secondary p-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.6} />
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Este aplicativo é um apoio à escrita terapêutica e <strong>não substitui</strong> a
            terapia nem qualquer acompanhamento psicológico ou psiquiátrico. Buscar apoio
            profissional é um cuidado importante — e você merece esse cuidado. Em sofrimento
            intenso, procure ajuda imediata ou ligue para o CVV (188).
          </p>
          {!compact && (
            <p className="text-sm text-muted-foreground">
              Se quiser dar esse passo, a psicóloga <strong>{PSICOLOGA.nome}</strong> atende pelo
              WhatsApp {PSICOLOGA.telefoneVisivel}.
            </p>
          )}
          <WhatsAppButton />
        </div>
      </div>
    </section>
  );
}

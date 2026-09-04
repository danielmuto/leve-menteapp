import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de uso — Levemente" },
      {
        name: "description",
        content: "Condições de uso do Levemente, o diário guiado de escrita terapêutica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Termos de uso — Levemente" },
      { property: "og:description", content: "Regras simples para usar o seu diário guiado." },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <main className="mx-auto max-w-2xl space-y-5 px-5 py-14">
      <h1 className="text-3xl">Termos de uso</h1>
      <p className="text-muted-foreground">
        O Levemente é um apoio à saúde emocional por meio da escrita guiada. Ele não substitui
        avaliação, diagnóstico ou acompanhamento profissional. Em momentos de crise, ligue para o
        CVV (188).
      </p>
      <p className="text-muted-foreground">
        O cadastro é gratuito e inclui quatro exercícios sempre livres. A assinatura mensal de R$
        39,90 é opcional, sem fidelidade, e pode ser cancelada a qualquer momento.
      </p>
      <p className="text-muted-foreground">
        Você é responsável pelo conteúdo que escreve e por manter seus dados de acesso em sigilo.
      </p>
      <Link to="/" className="inline-block text-primary underline-offset-4 hover:underline">
        Voltar para o início
      </Link>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Levemente" },
      {
        name: "description",
        content: "Como o Levemente guarda e protege o que você escreve no seu diário.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Política de privacidade — Levemente" },
      { property: "og:description", content: "Seus textos são privados e só seus." },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <main className="mx-auto max-w-2xl space-y-5 px-5 py-14">
      <h1 className="text-3xl">Política de privacidade</h1>
      <p className="text-muted-foreground">
        Tudo o que você escreve fica guardado para você e não é compartilhado com terceiros nem
        usado para publicidade.
      </p>
      <p className="text-muted-foreground">
        Coletamos apenas o necessário para o seu acesso funcionar: nome, e-mail e os registros do
        seu diário. Você pode apagar seus registros a qualquer momento pelo próprio aplicativo.
      </p>
      <p className="text-muted-foreground">
        Dúvidas sobre seus dados? Fale com a gente pelo perfil dentro do aplicativo.
      </p>
      <Link to="/" className="inline-block text-primary underline-offset-4 hover:underline">
        Voltar para o início
      </Link>
    </main>
  );
}

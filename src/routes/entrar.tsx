import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { HeaderWash, ExerciseArt } from "@/components/Art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Escrita Terapêutica" },
      {
        name: "description",
        content: "Acesse seu diário de escrita terapêutica com e-mail e senha.",
      },
      { property: "og:title", content: "Entrar — Escrita Terapêutica" },
      { property: "og:description", content: "Seu diário guiado, sempre onde você deixou." },
    ],
  }),
  component: Auth,
});

type Mode = "entrar" | "criar" | "recuperar";

function Auth() {
  const navigate = useNavigate();
  const { state, update } = useApp();
  const [mode, setMode] = useState<Mode>(state.email ? "entrar" : "criar");
  const [email, setEmail] = useState(state.email ?? "");
  const [senha, setSenha] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Confira o e-mail, por favor.");
      return;
    }
    if (mode === "recuperar") {
      toast.success("Enviamos um link de recuperação para o seu e-mail.");
      setMode("entrar");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha precisa de pelo menos 6 caracteres.");
      return;
    }
    update({ email, onboarded: true, name: state.name || "você" });
    toast.success(mode === "criar" ? "Que bom ter você aqui." : "Bem-vinda de volta.");
    navigate({ to: "/inicio" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80">
        <HeaderWash className="h-full w-full blur-3xl" />
      </div>
      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-14">
        <ExerciseArt kind="gratitude" size={84} className="mb-6" />
        <h1 className="text-3xl">
          {mode === "criar"
            ? "Criar sua conta"
            : mode === "entrar"
              ? "Entrar no seu diário"
              : "Recuperar acesso"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "recuperar"
            ? "Enviamos um link para você criar uma nova senha."
            : "Tudo o que você escreve fica guardado só para você."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl bg-card"
              placeholder="voce@email.com"
            />
          </div>
          {mode !== "recuperar" && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12 rounded-2xl bg-card"
                placeholder="No mínimo 6 caracteres"
              />
            </div>
          )}
          <Button type="submit" size="lg" className="min-h-12 w-full rounded-full">
            {mode === "criar" ? "Criar conta" : mode === "entrar" ? "Entrar" : "Enviar link"}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          {mode !== "recuperar" && (
            <button
              className="underline-offset-4 hover:underline"
              onClick={() => setMode(mode === "criar" ? "entrar" : "criar")}
            >
              {mode === "criar" ? "Já tenho conta" : "Ainda não tenho conta"}
            </button>
          )}
          <div>
            <button
              className="underline-offset-4 hover:underline"
              onClick={() => setMode(mode === "recuperar" ? "entrar" : "recuperar")}
            >
              {mode === "recuperar" ? "Voltar para o login" : "Esqueci minha senha"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

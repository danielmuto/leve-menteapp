import { useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { startWavRecording, transcribeWav, type WavRecorder } from "@/lib/audio";

export function VoiceInput({ onText }: { onText: (text: string) => void }) {
  const [state, setState] = useState<"idle" | "recording" | "working">("idle");
  const rec = useRef<WavRecorder | null>(null);

  async function start() {
    try {
      rec.current = await startWavRecording();
      setState("recording");
    } catch {
      toast.error("Preciso da permissão do microfone para ouvir você.");
    }
  }

  async function stop() {
    const r = rec.current;
    rec.current = null;
    if (!r) return;
    setState("working");
    try {
      const wav = await r.stop();
      if (wav.size < 4096) {
        toast("Não ouvi nada — tente falar um pouquinho mais.");
        return;
      }
      const text = await transcribeWav(wav);
      if (!text) {
        toast("Não consegui entender o áudio. Quer tentar de novo?");
        return;
      }
      onText(text);
      toast.success("Pronto — suas palavras estão no papel.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não consegui transcrever agora.");
    } finally {
      setState("idle");
    }
  }

  const recording = state === "recording";
  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      disabled={state === "working"}
      aria-label={recording ? "Parar de ditar" : "Ditar em vez de escrever"}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
        recording
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted/60"
      }`}
    >
      {state === "working" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : recording ? (
        <Square className="size-4 fill-current" />
      ) : (
        <Mic className="size-4" />
      )}
      {state === "working" ? "Transcrevendo..." : recording ? "Parar e transcrever" : "Ditar"}
    </button>
  );
}

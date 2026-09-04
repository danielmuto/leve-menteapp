import { useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { blobToDataUrl, startMemoRecording, type MemoRecorder } from "@/lib/audio";

export type AudioNote = { id: string; url: string; seconds: number };

export function AudioMemo({
  notes,
  onChange,
}: {
  notes: AudioNote[];
  onChange: (notes: AudioNote[]) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const rec = useRef<MemoRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function start() {
    try {
      rec.current = await startMemoRecording();
      setRecording(true);
      setSeconds(0);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Preciso da permissão do microfone para gravar.");
    }
  }

  async function stop() {
    const r = rec.current;
    rec.current = null;
    if (timer.current) clearInterval(timer.current);
    setRecording(false);
    if (!r) return;
    const blob = await r.stop();
    if (blob.size < 1024) {
      toast("A gravação ficou vazia. Tente de novo com calma.");
      return;
    }
    if (blob.size > 3 * 1024 * 1024) {
      toast("Essa gravação ficou longa demais para guardar. Tente trechos de até ~2 minutos.");
      return;
    }
    const url = await blobToDataUrl(blob);
    onChange([...notes, { id: Math.random().toString(36).slice(2), url, seconds }]);
    toast.success("Áudio guardado com o seu registro.");
  }

  return (
    <div className="rounded-3xl border border-mauve/25 bg-mauve-soft/30 p-5">
      <p className="text-sm font-medium">Prefere falar?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Grave um áudio e ele fica guardado junto do seu registro, só para você ouvir depois.
      </p>

      <button
        type="button"
        onClick={recording ? stop : start}
        className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm transition-colors ${
          recording
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card hover:bg-card/70"
        }`}
      >
        {recording ? <Square className="size-4 fill-current" /> : <Mic className="size-4" />}
        {recording ? `Parar gravação (${seconds}s)` : "Gravar áudio"}
      </button>

      {notes.length > 0 && (
        <ul className="mt-4 space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="flex items-center gap-3">
              <audio controls src={n.url} className="h-10 w-full max-w-sm" />
              <button
                type="button"
                aria-label="Apagar áudio"
                onClick={() => onChange(notes.filter((x) => x.id !== n.id))}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

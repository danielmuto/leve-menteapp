import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

async function fileToSquareDataUrl(file: File, size = 320) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function AvatarPicker({
  value,
  onChange,
  name,
  size = 88,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  name?: string;
  size?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "✍️";

  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha uma imagem (JPG ou PNG).");
      return;
    }
    setBusy(true);
    try {
      onChange(await fileToSquareDataUrl(file));
      toast.success("Foto atualizada.");
    } catch {
      toast.error("Não consegui ler essa imagem. Tente outra.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label="Escolher foto de perfil"
        className="relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-primary-soft/50 text-2xl text-foreground shadow-soft transition-transform hover:scale-[1.02]"
        style={{ width: size, height: size }}
      >
        {value ? (
          <img src={value} alt="Sua foto de perfil" className="size-full object-cover" />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-center bg-foreground/45 text-card">
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" strokeWidth={1.8} />
          )}
        </span>
      </button>

      <div className="space-y-1">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="min-h-11 rounded-full border border-border px-4 text-sm hover:bg-accent/60"
        >
          {value ? "Trocar foto" : "Adicionar foto"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-4" /> Remover
          </button>
        )}
        <p className="text-xs text-muted-foreground">A foto fica só no seu dispositivo.</p>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

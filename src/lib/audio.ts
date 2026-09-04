/** Gravação de voz: WAV (para transcrição) e memo de áudio (para guardar no diário). */

function encodeWav(chunks: Float32Array[], sampleRate: number, targetRate = 16000) {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  const ratio = sampleRate / targetRate;
  const outLength = Math.floor(merged.length / ratio);
  const samples = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const v = merged[Math.floor(i * ratio)] ?? 0;
    samples[i] = Math.max(-1, Math.min(1, v)) * 32767;
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (pos: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(pos + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  new Int16Array(buffer, 44).set(samples);
  return new Blob([buffer], { type: "audio/wav" });
}

export type WavRecorder = { stop: () => Promise<Blob>; cancel: () => void };

/** Captura PCM e devolve um WAV completo — seguro em todos os navegadores. */
export async function startWavRecording(): Promise<WavRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
    },
  });
  const ctx = new AudioContext();
  if (ctx.state === "suspended") await ctx.resume().catch(() => {});
  const source = ctx.createMediaStreamSource(stream);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  const pcm: Float32Array[] = [];
  node.onaudioprocess = (e) => pcm.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  source.connect(node);
  node.connect(ctx.destination);

  const teardown = async () => {
    stream.getTracks().forEach((t) => t.stop());
    node.disconnect();
    source.disconnect();
    const rate = ctx.sampleRate;
    await ctx.close().catch(() => {});
    return rate;
  };

  return {
    async stop() {
      const rate = await teardown();
      return encodeWav(pcm, rate);
    },
    cancel() {
      void teardown();
    },
  };
}

/** Memo de áudio comprimido (opus/webm ou mp4 no Safari) para guardar no diário. */
export type MemoRecorder = { stop: () => Promise<Blob>; cancel: () => void };

export async function startMemoRecording(): Promise<MemoRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((m) =>
    typeof MediaRecorder !== "undefined" ? MediaRecorder.isTypeSupported(m) : false,
  );
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const parts: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) parts.push(e.data);
  };
  recorder.start();

  const stopTracks = () => stream.getTracks().forEach((t) => t.stop());

  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          stopTracks();
          resolve(new Blob(parts, { type: recorder.mimeType || "audio/webm" }));
        };
        recorder.stop();
      }),
    cancel() {
      try {
        recorder.stop();
      } catch {
        /* ignore */
      }
      stopTracks();
    },
  };
}

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Envia o WAV para a rota de transcrição e devolve o texto (streaming SSE). */
export async function transcribeWav(wav: Blob, onDelta?: (text: string) => void) {
  const form = new FormData();
  form.append("file", wav, "recording.wav");
  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  if (!res.ok || !res.body) {
    throw new Error((await res.text().catch(() => "")) || "Não consegui transcrever agora.");
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as { type?: string; delta?: string; text?: string };
        if (evt.type === "transcript.text.delta" && evt.delta) {
          text += evt.delta;
          onDelta?.(evt.delta);
        } else if (evt.type === "transcript.text.done" && evt.text) {
          text = evt.text;
        }
      } catch {
        /* ignore */
      }
    }
  }
  return text.trim();
}

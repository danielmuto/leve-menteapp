import { jsPDF } from "jspdf";
import { getExercise } from "./exercises";
import type { Entry } from "./store";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function exportEntriesToPdf(entries: Entry[], name: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const nextPage = (needed: number) => {
    if (y + needed > bottom) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("times", "normal");
  doc.setFontSize(22);
  doc.text("Escrita Terapêutica", margin, y);
  y += 26;
  doc.setFontSize(11);
  doc.setTextColor(120);
  doc.text(
    `Diário de ${name || "escrita"} · gerado em ${fmt.format(new Date())}`,
    margin,
    y,
  );
  y += 12;
  doc.setDrawColor(210);
  doc.line(margin, y, margin + width, y);
  y += 26;
  doc.setTextColor(40);

  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  for (const entry of sorted) {
    const ex = getExercise(entry.slug);
    nextPage(60);
    doc.setFontSize(10);
    doc.setTextColor(140);
    doc.text(fmt.format(new Date(entry.createdAt)), margin, y);
    y += 16;
    doc.setFontSize(15);
    doc.setTextColor(40);
    doc.text(entry.title, margin, y);
    y += 18;

    const fields = ex?.fields ?? Object.keys(entry.values).map((k) => ({ key: k, label: k }));
    for (const f of fields) {
      const value = entry.values[f.key]?.trim();
      if (!value) continue;
      nextPage(40);
      doc.setFontSize(9.5);
      doc.setTextColor(150);
      doc.text(f.label.toUpperCase(), margin, y);
      y += 14;
      doc.setFontSize(11.5);
      doc.setTextColor(50);
      const lines: string[] = doc.splitTextToSize(value, width);
      for (const line of lines) {
        nextPage(18);
        doc.text(line, margin, y);
        y += 16;
      }
      y += 6;
    }
    y += 14;
    nextPage(20);
    doc.setDrawColor(230);
    doc.line(margin, y - 8, margin + width, y - 8);
    y += 10;
  }

  doc.save("diario-escrita-terapeutica.pdf");
}

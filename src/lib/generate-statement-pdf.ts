import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Account, CustomerProfile, Transaction } from "./types";
import { formatDate } from "./format";

const BRAND_600: [number, number, number] = [18, 132, 136];
const INK_900: [number, number, number] = [7, 26, 32];
const INK_600: [number, number, number] = [90, 104, 108];
const EMERALD_600: [number, number, number] = [5, 150, 105];
const LINE: [number, number, number] = [225, 224, 217];

function drawLogo(doc: jsPDF, x: number, y: number, size: number) {
  const s = size / 36;
  doc.setFillColor(...BRAND_600);
  doc.roundedRect(x, y, size, size, size * 0.22, size * 0.22, "F");

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.55 * s * 2.6);
  doc.setLineCap("round");
  doc.setLineJoin("round");

  const p = (vx: number, vy: number): [number, number] => [x + vx * s, y + vy * s];

  const segments: [number, number, number, number][] = [
    [18, 8.5, 18, 25],
    [18, 8.5, 10.5, 25],
    [18, 8.5, 25.5, 25],
    [6.5, 25, 29.5, 25],
    [9, 25, 9, 27.5],
    [27, 25, 27, 27.5],
  ];

  for (const [x1, y1, x2, y2] of segments) {
    const [px1, py1] = p(x1, y1);
    const [px2, py2] = p(x2, y2);
    doc.line(px1, py1, px2, py2);
  }
}

export function generateStatementPdf({
  profile,
  account,
  periodLabel,
  transactions,
}: {
  profile: CustomerProfile;
  account: Account;
  periodLabel: string;
  transactions: Transaction[];
}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const marginX = 18;
  let cursorY = 20;

  // Header: logo mark + wordmark
  drawLogo(doc, marginX, cursorY - 8, 11);
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...INK_900);
  doc.text("Stonebridge Finance", marginX + 14, cursorY - 1.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND_600);
  doc.text("O N L I N E   B A N K I N G", marginX + 14, cursorY + 2.8);

  // Header right: statement label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK_900);
  doc.text("Account Statement", 216 - marginX, cursorY - 1.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_600);
  doc.text(`Generated ${formatDate(new Date().toISOString().slice(0, 10))}`, 216 - marginX, cursorY + 2.8, {
    align: "right",
  });

  cursorY += 12;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(marginX, cursorY, 216 - marginX, cursorY);

  // Account / customer details
  cursorY += 8;
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_600);
  doc.text("STATEMENT PERIOD", marginX, cursorY);
  doc.text("ACCOUNT HOLDER", marginX + 65, cursorY);
  doc.text("ACCOUNT", marginX + 130, cursorY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK_900);
  doc.text(periodLabel, marginX, cursorY + 5.5);
  doc.text(profile.name, marginX + 65, cursorY + 5.5);
  doc.text(`${account.nickname}`, marginX + 130, cursorY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK_600);
  doc.text(account.accountNumberMasked, marginX + 130, cursorY + 10);

  cursorY += 16;

  // Summary tiles
  const totalIn = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const netChange = totalIn + totalOut;
  const tileWidth = (216 - marginX * 2 - 8) / 3;
  const tiles: [string, string, [number, number, number]][] = [
    ["Total Credits", `+${formatMoney(totalIn)}`, EMERALD_600],
    ["Total Debits", `-${formatMoney(Math.abs(totalOut))}`, INK_900],
    ["Net Change", `${netChange >= 0 ? "+" : "-"}${formatMoney(Math.abs(netChange))}`, netChange >= 0 ? EMERALD_600 : INK_900],
  ];
  tiles.forEach(([label, value, color], i) => {
    const tx = marginX + i * (tileWidth + 4);
    doc.setDrawColor(...LINE);
    doc.setFillColor(250, 249, 246);
    doc.roundedRect(tx, cursorY, tileWidth, 16, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...INK_600);
    doc.text(label.toUpperCase(), tx + 4, cursorY + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...color);
    doc.text(value, tx + 4, cursorY + 12.5);
  });

  cursorY += 24;

  // Transaction table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [["Date", "Description", "Category", "Status", "Amount"]],
    body: transactions.map((t) => [
      formatDate(t.date),
      `${t.merchant}${t.description && t.description !== t.merchant ? `\n${t.description}` : ""}`,
      t.category,
      t.status === "posted" ? "Posted" : "Pending",
      `${t.amount < 0 ? "-" : "+"}${formatMoney(Math.abs(t.amount))}`,
    ]),
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      textColor: INK_900,
      cellPadding: 3,
      lineColor: LINE,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: INK_900,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [250, 249, 246] },
    columnStyles: {
      0: { cellWidth: 22 },
      2: { cellWidth: 28 },
      3: { cellWidth: 20 },
      4: { cellWidth: 26, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const raw = String(data.cell.raw);
        data.cell.styles.textColor = raw.startsWith("+") ? EMERALD_600 : INK_900;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Footer summary + page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.line(marginX, 273, 216 - marginX, 273);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...INK_600);
    doc.text("Stonebridge Finance", marginX, 278);
    doc.text(`Page ${i} of ${pageCount}`, 216 - marginX, 278, { align: "right" });
  }

  return doc;
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

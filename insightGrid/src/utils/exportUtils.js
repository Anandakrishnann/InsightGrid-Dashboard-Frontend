/**
 * Export utilities: CSV, chart images, PDF report
 */

// CSV: Convert insights array to CSV and trigger download
export const exportToCSV = (insights) => {
  if (!insights?.length) return;
  const cols = ["intensity", "likelihood", "relevance", "year", "end_year", "country", "city", "region", "topics", "sector", "pestle", "source", "swot"];
  const header = cols.join(",");
  const rows = insights.map((row) =>
    cols.map((c) => {
      const v = row[c];
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `insightgrid-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Chart: Get image data URL from Chart.js instance
export const chartToImage = (chartRef) => {
  if (!chartRef?.current) return null;
  try {
    return chartRef.current.toBase64Image?.("image/png") || null;
  } catch {
    return null;
  }
};

// Download a single image
export const downloadImage = (dataUrl, filename) => {
  if (!dataUrl) return;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
};

const chartNames = ["intensity-by-country", "top-countries", "year-trend", "topic-distribution"];

export const exportChartsAsImages = (chartRefs) => {
  const dateStr = new Date().toISOString().slice(0, 10);
  chartRefs.forEach((ref, i) => {
    const dataUrl = chartToImage(ref);
    if (dataUrl) {
      setTimeout(() => {
        downloadImage(dataUrl, `insightgrid-${chartNames[i]}-${dateStr}.png`);
      }, i * 200);
    }
  });
};

// PDF Report: summary + charts + data table (dynamic imports to avoid parse issues)
export const exportToPDF = async (options) => {
  const [{ jsPDF }, { default: autoTable }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    import("html2canvas"),
  ]);
  const { insights, summary, chartRefs, heatMapRef } = options;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const dateStr = new Date().toISOString().slice(0, 10);

  let y = 15;

  doc.setFontSize(18);
  doc.text("InsightGrid Report", 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${dateStr}`, 14, y);
  y += 10;

  if (summary) {
    doc.setFontSize(12);
    doc.text("Summary", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Total Records: ${summary.total}  |  Avg Intensity: ${summary.avgIntensity}  |  Countries: ${summary.countries}`, 14, y);
    y += 10;
  }

  // Add charts
  if (chartRefs?.length) {
    const w = 90;
    const h = 50;
    chartRefs.forEach((ref, i) => {
      const img = chartToImage(ref);
      if (img) {
        if (y + h > 270) {
          doc.addPage();
          y = 15;
        }
        doc.setFontSize(10);
        doc.text(chartNames[i].replace(/-/g, " "), 14, y);
        y += 5;
        doc.addImage(img, "PNG", 14, y, w, h);
        y += h + 10;
      }
    });
  }

  // Heat map (from html2canvas)
  if (heatMapRef?.current) {
    try {
      const canvas = await html2canvas(heatMapRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      if (y + 60 > 270) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(10);
      doc.text("Heat Map", 14, y);
      y += 5;
      doc.addImage(imgData, "PNG", 14, y, 180, 50);
      y += 55;
    } catch (e) {
      console.warn("Heat map capture failed", e);
    }
  }

  // Data table
  if (insights?.length) {
    if (y > 200) {
      doc.addPage();
      y = 15;
    }
    doc.setFontSize(12);
    doc.text("Data (first 50 records)", 14, y);
    y += 8;

    const cols = ["country", "year", "intensity", "topics", "sector"];
    const rows = insights.slice(0, 50).map((r) =>
      cols.map((c) => (r[c] != null ? String(r[c]) : ""))
    );
    autoTable(doc, {
      head: [cols.map((c) => c.toUpperCase())],
      body: rows,
      startY: y,
      theme: "grid",
      styles: { fontSize: 8 },
    });
  }

  doc.save(`insightgrid-report-${dateStr}.pdf`);
};

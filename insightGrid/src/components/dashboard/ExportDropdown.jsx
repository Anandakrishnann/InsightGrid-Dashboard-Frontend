import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import {
  exportChartsAsImages,
  exportToPDF,
} from "../../utils/exportUtils";

const ExportDropdown = ({ chartRefs, heatMapRef }) => {
  const [open, setOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const menuRef = useRef();

  const insights = useSelector((state) => state.insights.insights) || [];
  const countryIntensity = useSelector((state) => state.insights.countryIntensity) || [];
  const currentFilters = useSelector((state) => state.insights.currentFilters) || {};

  const total = insights.length;
  const avgIntensity =
    insights.reduce((acc, item) => acc + (item.intensity || 0), 0) / (total || 1);
  const uniqueCountries = new Set(insights.map((i) => i.country).filter(Boolean)).size;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCSV = () => {
    const base = axiosInstance.defaults.baseURL;
    const qs = new URLSearchParams(currentFilters).toString();
    const url = `${base}/api/export/csv/${qs ? "?" + qs : ""}`;
    const token = localStorage.getItem("insight_access");
    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.blob())
      .then((blob) => {
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = u;
        a.download = `insightgrid-export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(u);
        toast.success("CSV downloaded");
      })
      .catch(() => toast.error("Export failed"));
    setOpen(false);
  };

  const handleChartsImage = () => {
    exportChartsAsImages(chartRefs || []);
    toast.success("Charts downloaded");
    setOpen(false);
  };

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await exportToPDF({
        insights,
        summary: {
          total,
          avgIntensity: avgIntensity.toFixed(1),
          countries: uniqueCountries || countryIntensity.length,
        },
        chartRefs: chartRefs || [],
        heatMapRef,
      });
      toast.success("PDF report downloaded");
      setOpen(false);
    } catch (e) {
      toast.error("PDF export failed");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
      >
        Export
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={handleCSV}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Download CSV
          </button>
          <button
            onClick={handleChartsImage}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Download Charts (PNG)
          </button>
          <button
            onClick={handlePDF}
            disabled={pdfLoading}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-70"
          >
            {pdfLoading ? "Generating..." : "Export PDF Report"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;

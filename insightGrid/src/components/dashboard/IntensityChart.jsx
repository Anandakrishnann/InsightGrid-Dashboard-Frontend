import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const IntensityChart = ({ chartRef }) => {
  const insights = useSelector((state) => state.insights.insights) || [];

  if (insights.length === 0) return <p className="text-gray-500 text-sm py-8">No data</p>;

  const byCountry = {};
  insights.forEach((item) => {
    const c = item.country || "Unknown";
    if (!byCountry[c]) byCountry[c] = [];
    byCountry[c].push(item.intensity);
  });
  const labels = Object.keys(byCountry).slice(0, 10);
  const data = labels.map((c) => {
    const arr = byCountry[c].filter(Boolean);
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  });

  return (
    <div className="chart-container">
      <Bar
        ref={chartRef}
        data={{
          labels,
          datasets: [{ label: "Intensity", data, backgroundColor: "rgba(99, 102, 241, 0.6)" }],
        }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default IntensityChart;

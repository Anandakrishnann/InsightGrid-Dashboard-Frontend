import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const YearTrendChart = ({ chartRef }) => {
  const yearTrend = useSelector((state) => state.insights.yearTrend) || [];

  if (yearTrend.length === 0) return <p className="text-gray-500 text-sm py-8">No data</p>;

  const sorted = [...yearTrend].filter((d) => d.year != null).sort((a, b) => a.year - b.year);
  const labels = sorted.map((d) => String(d.year));
  const values = sorted.map((d) => d.avg_intensity ?? d.intensity ?? 0);

  return (
    <div className="chart-container">
      <Line
        ref={chartRef}
        data={{
          labels,
          datasets: [
            {
              label: "Avg Intensity",
              data: values,
              borderColor: "rgb(99, 102, 241)",
              tension: 0.3,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default YearTrendChart;

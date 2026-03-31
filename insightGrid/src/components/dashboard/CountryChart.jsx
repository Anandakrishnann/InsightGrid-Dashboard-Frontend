import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const CountryChart = ({ chartRef }) => {
  const countryIntensity = useSelector((state) => state.insights.countryIntensity) || [];

  if (countryIntensity.length === 0) return <p className="text-gray-500 text-sm py-8">No data</p>;

  const top = countryIntensity.slice(0, 10).filter((d) => d.country);
  const labels = top.map((d) => d.country || "Unknown");
  const values = top.map((d) => d.avg_intensity ?? d.intensity ?? 0);

  return (
    <div className="chart-container">
      <Bar
        ref={chartRef}
        data={{
          labels,
          datasets: [{ label: "Avg Intensity", data: values, backgroundColor: "rgba(99, 102, 241, 0.6)" }],
        }}
        options={{ responsive: true, maintainAspectRatio: false, indexAxis: "y" }}
      />
    </div>
  );
};

export default CountryChart;

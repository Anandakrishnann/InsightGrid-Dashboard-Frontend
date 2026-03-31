import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff"];

const TopicDistributionChart = ({ chartRef }) => {
  const topicDistribution = useSelector((state) => state.insights.topicDistribution) || [];

  if (topicDistribution.length === 0) return <p className="text-gray-500 text-sm py-8">No data</p>;

  const top = topicDistribution.slice(0, 7).filter((d) => d.topics);
  const labels = top.map((d) => (d.topics || d.topic || "Unknown").substring(0, 15));
  const values = top.map((d) => d.count);

  return (
    <div className="chart-container flex items-center">
      <Doughnut
        ref={chartRef}
        data={{
          labels,
          datasets: [{ data: values, backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]) }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "right" } },
        }}
      />
    </div>
  );
};

export default TopicDistributionChart;

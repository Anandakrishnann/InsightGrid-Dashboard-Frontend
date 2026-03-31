import { useSelector } from "react-redux";

const SummaryCards = () => {
  const insights = useSelector((state) => state.insights.insights) || [];
  const countryIntensity = useSelector((state) => state.insights.countryIntensity) || [];

  const total = insights.length;
  const avgIntensity =
    insights.reduce((acc, item) => acc + (item.intensity || 0), 0) / (total || 1);
  const uniqueCountries = new Set(insights.map((i) => i.country).filter(Boolean)).size;
  const topCountry = countryIntensity[0]?.country || "—";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-sm text-gray-500">Total Records</p>
        <p className="text-xl font-semibold text-gray-800">{total.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-sm text-gray-500">Avg Intensity</p>
        <p className="text-xl font-semibold text-gray-800">{avgIntensity.toFixed(1)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-sm text-gray-500">Active Countries</p>
        <p className="text-xl font-semibold text-gray-800">{uniqueCountries || countryIntensity.length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-sm text-gray-500">Top Country</p>
        <p className="text-xl font-semibold text-gray-800 truncate">{topCountry}</p>
      </div>
    </div>
  );
};

export default SummaryCards;

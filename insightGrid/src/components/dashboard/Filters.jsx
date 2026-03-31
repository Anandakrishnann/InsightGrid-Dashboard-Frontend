import { useDispatch } from "react-redux";
import {
  fetchInsights,
  fetchCountryIntensity,
  fetchYearTrend,
  fetchTopicDistribution,
  fetchHeatMap,
  setCurrentFilters,
} from "../../features/insights/insightsSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const initialFilters = {
  end_year: "",
  topics: "",
  sector: "",
  region: "",
  pestle: "",
  source: "",
  swot: "",
  country: "",
  city: "",
};

const filterLabels = {
  end_year: "End Year",
  topics: "Topic",
  sector: "Sector",
  region: "Region",
  pestle: "PESTLE",
  source: "Source",
  swot: "SWOT",
  country: "Country",
  city: "City",
};

const Filters = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(initialFilters);
  const [open, setOpen] = useState(false);

  const applyFilters = () => {
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    dispatch(setCurrentFilters(cleaned));
    dispatch(fetchInsights(cleaned));
    dispatch(fetchCountryIntensity(cleaned));
    dispatch(fetchYearTrend(cleaned));
    dispatch(fetchTopicDistribution(cleaned));
    dispatch(fetchHeatMap(cleaned));
    toast.success("Filters applied");
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    dispatch(setCurrentFilters({}));
    dispatch(fetchInsights());
    dispatch(fetchCountryIntensity());
    dispatch(fetchYearTrend());
    dispatch(fetchTopicDistribution());
    dispatch(fetchHeatMap());
    toast.info("Filters reset");
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50"
      >
        Filters {open ? "↑" : "↓"}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
            {Object.keys(initialFilters).map((key) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{filterLabels[key]}</label>
                <input
                  name={key}
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                  placeholder={filterLabels[key]}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Apply
            </button>
            <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;

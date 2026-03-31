import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  fetchInsights,
  fetchCountryIntensity,
  fetchYearTrend,
  fetchTopicDistribution,
  fetchHeatMap,
} from "../features/insights/insightsSlice";

import Filters from "../components/dashboard/Filters";
import IntensityChart from "../components/dashboard/IntensityChart";
import CountryChart from "../components/dashboard/CountryChart";
import YearTrendChart from "../components/dashboard/YearTrendChart";
import TopicDistributionChart from "../components/dashboard/TopicDistributionChart";
import HeatMap from "../components/dashboard/HeatMap";
import SummaryCards from "../components/dashboard/SummaryCards";
import ExportDropdown from "../components/dashboard/ExportDropdown";

const Dashboard = () => {
  const dispatch = useDispatch();
  const intensityChartRef = useRef();
  const countryChartRef = useRef();
  const yearTrendChartRef = useRef();
  const topicChartRef = useRef();
  const heatMapRef = useRef();
  const chartRefs = [intensityChartRef, countryChartRef, yearTrendChartRef, topicChartRef];

  useEffect(() => {
    dispatch(fetchInsights());
    dispatch(fetchCountryIntensity());
    dispatch(fetchYearTrend());
    dispatch(fetchTopicDistribution());
    dispatch(fetchHeatMap());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-end mb-2">
        <ExportDropdown chartRefs={chartRefs} heatMapRef={heatMapRef} />
      </div>
      <SummaryCards />
      <Filters />

      <div className="bg-white rounded-lg shadow border border-gray-100 p-4 mb-6" ref={heatMapRef}>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Heat Map (Country × Year)</h3>
        <HeatMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Intensity by Country</h3>
          <IntensityChart chartRef={intensityChartRef} />
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Countries</h3>
          <CountryChart chartRef={countryChartRef} />
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Year Trend</h3>
          <YearTrendChart chartRef={yearTrendChartRef} />
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Topic Distribution</h3>
          <TopicDistributionChart chartRef={topicChartRef} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

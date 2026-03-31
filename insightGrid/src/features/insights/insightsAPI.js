import axiosInstance from "../../services/axiosInstance";

export const fetchInsightsAPI = (params) =>
  axiosInstance.get("/api/insights/", { params });

export const fetchCountryIntensityAPI = (params) =>
  axiosInstance.get("/api/country-intensity/", { params });

export const fetchYearTrendAPI = (params) =>
  axiosInstance.get("/api/year-trend/", { params });

export const fetchTopicDistributionAPI = (params) =>
  axiosInstance.get("/api/topic-distribution/", { params });

export const fetchHeatMapAPI = (params) =>
  axiosInstance.get("/api/heatmap/", { params });
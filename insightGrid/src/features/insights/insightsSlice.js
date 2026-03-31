import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchInsightsAPI,
  fetchCountryIntensityAPI,
  fetchYearTrendAPI,
  fetchTopicDistributionAPI,
  fetchHeatMapAPI,
} from "./insightsAPI";

export const fetchInsights = createAsyncThunk(
  "insights/fetchInsights",
  async (params = {}) => {
    const response = await fetchInsightsAPI(params);
    return response.data;
  }
);

export const fetchCountryIntensity = createAsyncThunk(
  "insights/fetchCountryIntensity",
  async (params = {}) => {
    const response = await fetchCountryIntensityAPI(params);
    return response.data;
  }
);

export const fetchYearTrend = createAsyncThunk(
  "insights/fetchYearTrend",
  async (params = {}) => {
    const response = await fetchYearTrendAPI(params);
    return response.data;
  }
);

export const fetchTopicDistribution = createAsyncThunk(
  "insights/fetchTopicDistribution",
  async (params = {}) => {
    const response = await fetchTopicDistributionAPI(params);
    return response.data;
  }
);

export const fetchHeatMap = createAsyncThunk(
  "insights/fetchHeatMap",
  async (params = {}) => {
    const response = await fetchHeatMapAPI(params);
    return response.data;
  }
);

const insightsSlice = createSlice({
  name: "insights",
  initialState: {
    insights: [],
    countryIntensity: [],
    yearTrend: [],
    topicDistribution: [],
    heatMap: [],
    currentFilters: {},
    loading: false,
  },
  reducers: {
    setCurrentFilters: (state, action) => {
      state.currentFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload.results || action.payload;
      })
      .addCase(fetchInsights.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchCountryIntensity.fulfilled, (state, action) => {
        state.countryIntensity = action.payload;
      })
      .addCase(fetchYearTrend.fulfilled, (state, action) => {
        state.yearTrend = action.payload;
      })
      .addCase(fetchTopicDistribution.fulfilled, (state, action) => {
        state.topicDistribution = action.payload;
      })
      .addCase(fetchHeatMap.fulfilled, (state, action) => {
        state.heatMap = action.payload;
      });
  },
});

export const { setCurrentFilters } = insightsSlice.actions;
export default insightsSlice.reducer;
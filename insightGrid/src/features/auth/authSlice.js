import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI } from "./authAPI";
import { setTokens, clearTokens, getAccessToken, getUser } from "../../utils/auth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await loginAPI(email, password);
      setTokens(data.access, data.refresh, data.user);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  clearTokens();
});

const loadInitialAuth = () => {
  const token = getAccessToken();
  const user = getUser();
  return { token: !!token, user };
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadInitialAuth().user,
    isAuthenticated: loadInitialAuth().token,
    loading: false,
  },
  reducers: {
    setAuthFromStorage: (state) => {
      const { token, user } = loadInitialAuth();
      state.isAuthenticated = !!token;
      state.user = user;
    },
    clearAuth: (state) => {
      clearTokens();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthFromStorage, clearAuth } = authSlice.actions;
export default authSlice.reducer;

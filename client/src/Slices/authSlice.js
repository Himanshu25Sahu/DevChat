import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userData: null,
  token: null,
  error: null,
  isAuthorized: false,
  loading: false,
};

// Async action for signup
const signup = createAsyncThunk("signup", async (userCredentials) => {
  const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/auth/register`, userCredentials, {
    withCredentials: true,
  });  
  return data;
});

const login = createAsyncThunk('login', async (userCredentials) => {
  const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/auth/login`, userCredentials, {
    withCredentials: true,  // Include cookies in requests
  });
  return data;
});


const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.isAuthorized = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.isAuthorized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export { signup ,login};
export default authSlice.reducer;
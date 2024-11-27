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

const login = createAsyncThunk('login', async (userCredentials,{rejectWithValue }) => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/auth/login`,
      userCredentials,
      {
        withCredentials: true, // Include cookies
      }
    );
    return result.data;
  } catch (err) {
    console.error("Error in login thunk:", err);

    // Return a rejected value with the error message from the backend
    if (err.response) {
      // The request was made, and the server responded with a status code
      return rejectWithValue(err.response.data.error);
    } else if (err.request) {
      // The request was made, but no response was received
      return rejectWithValue("No response from server. Please try again.");
    } else {
      // Something else happened
      return rejectWithValue("An unexpected error occurred.");
    }
  }
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
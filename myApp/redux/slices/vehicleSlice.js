import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../localhost/localhost";

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/vehicles/getAll`);
    return response.data;
});

const vehicleSlice = createSlice({
    name: "vehicles",
    initialState: {
        list: [], // Đổi từ "vehicles" thành "list"
        status: "idle",
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicles.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload; // Đổi từ "vehicles" thành "list"
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default vehicleSlice.reducer;

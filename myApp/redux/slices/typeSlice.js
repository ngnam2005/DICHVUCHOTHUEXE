import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../localhost/localhost";

export const fetchTypes = createAsyncThunk("types/fetchTypes", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/types/getAll`);
    return response.data;
});

const typeSlice = createSlice({
    name: "types",
    initialState: {
        list: [], // Đổi từ "types" thành "list" để khớp với `useSelector`
        status: "idle",
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTypes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload; // Đổi từ "types" thành "list"
            })
            .addCase(fetchTypes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default typeSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../localhost/localhost';

// Add vehicle to cart
export const addVehicleToCart = createAsyncThunk(
    'cart/addVehicleToCart',
    async ({ userId, vehicleData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/cart/add`, {
                ...vehicleData,
                userId,
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update quantity
export const updateVehicleQuantity = createAsyncThunk(
    'cart/updateVehicleQuantity',
    async ({ userId, vehicleId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/cart/${userId}/vehicle/${vehicleId}`,
                { quantity }
            );
            return { vehicleId, quantity }; // Trả về info cần thiết để cập nhật state
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get cart
export const getCartByUserId = createAsyncThunk(
    'cart/getCartByUserId',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Remove vehicle
export const removeVehicleFromCart = createAsyncThunk(
    'cart/removeVehicleFromCart',
    async ({ userId, vehicleId }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/cart/${userId}/vehicle/${vehicleId}`);
            return { vehicleId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    cart: {
        vehicles: [],
    },
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get cart
            .addCase(getCartByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCartByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload || { vehicles: [] };
            })
            .addCase(getCartByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addVehicleToCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addVehicleToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload || { vehicles: [] };
            })
            .addCase(addVehicleToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update quantity
            .addCase(updateVehicleQuantity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateVehicleQuantity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { vehicleId, quantity } = action.payload;
                const vehicle = state.cart.vehicles?.find(v => v.vehicleId._id === vehicleId);
                if (vehicle) {
                    vehicle.quantity = quantity;
                }
            })
            .addCase(updateVehicleQuantity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Remove from cart
            .addCase(removeVehicleFromCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeVehicleFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { vehicleId } = action.payload;
                state.cart.vehicles = state.cart.vehicles?.filter(
                    v => v.vehicleId._id !== vehicleId
                );
            })
            .addCase(removeVehicleFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;

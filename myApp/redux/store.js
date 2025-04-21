import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/slices/authSlice";
import typeReducer from "../redux/slices/typeSlice";
import vehicleReducer from "../redux/slices/vehicleSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";




const store = configureStore({
    reducer: {
        auth: authReducer,
        types: typeReducer,
        vehicles: vehicleReducer,
        cart: cartReducer,
        order: orderReducer
    },
});

export default store;

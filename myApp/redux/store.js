import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/slices/authSlice";
import typeReducer from "../redux/slices/typeSlice";
import vehicleReducer from "../redux/slices/vehicleSlice";




const store = configureStore({
    reducer: {
        auth: authReducer,
        types: typeReducer,
        vehicles: vehicleReducer,
    },
});

export default store;

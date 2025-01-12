import { combineReducers } from '@reduxjs/toolkit';
import campaignReducer from './campaign/campaignSlice';
import cartReducer from './cart/cartSlice';

const rootReducer = combineReducers({
  campaign: campaignReducer,
  cart: cartReducer,
});

export default rootReducer;

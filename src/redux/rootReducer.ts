import { combineReducers } from '@reduxjs/toolkit';
import campaignReducer from './campaign/campaignSlice';

const rootReducer = combineReducers({
  campaign: campaignReducer,
});

export default rootReducer;

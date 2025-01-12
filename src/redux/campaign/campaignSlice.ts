import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICampaignState, IPagination, ISearchParams } from '../../types';

const initialState: ICampaignState = {
  searchParams: {
    page: 1,
    per_page: 10,
    date_from: '',
    date_to: '',
    lat_sw: 0,
    lng_sw: 0,
    lat_ne: 0,
    lng_ne: 0,
  },
  displays: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  },
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    updateSearchParams(state, action: PayloadAction<ISearchParams>) {
      state.searchParams = action.payload;
    },
    fetchCampaignStart(state, action: PayloadAction<ISearchParams>) {
      state.loading = true;
      state.error = null;
      state.searchParams = action.payload;
    },
    fetchCampaignSuccess(
      state,
      action: PayloadAction<{ displays: any[]; pagination: IPagination }>,
    ) {
      state.loading = false;
      state.displays = action.payload.displays;
      state.pagination = action.payload.pagination;
    },
    fetchCampaignFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateSearchParams,
  fetchCampaignStart,
  fetchCampaignSuccess,
  fetchCampaignFailure,
} = campaignSlice.actions;

export default campaignSlice.reducer;

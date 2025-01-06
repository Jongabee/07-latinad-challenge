import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ISearchParams, IDisplay, IApiResponse } from '../../types';

import { fetchDisplays } from '../../services/api';
import {
  convertToPesos,
  fetchDollarBlue,
} from '../../services/convertionPrice';

interface CampaignState {
  searchParams: ISearchParams;
  displays: IDisplay[];
  loading: boolean;
  error: string | null;

  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

const initialState: CampaignState = {
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

export const searchCampaign = createAsyncThunk<IApiResponse, ISearchParams>(
  'campaign/searchCampaign',
  async (searchParams, { rejectWithValue }) => {
    try {
      const [response, dollarBlueRate] = await Promise.all([
        fetchDisplays(searchParams),
        fetchDollarBlue(),
      ]);

      console.log('Valor del dólar blue:', dollarBlueRate);

      const displaysInPesos = response.data.map((display: IDisplay) => ({
        ...display,
        price_converted:
          Math.ceil(
            convertToPesos(display.price_per_day, dollarBlueRate) / 100,
          ) * 100,
      }));

      return {
        ...response,
        data: displaysInPesos,
      };
    } catch (error) {
      console.error('Error en searchCampaign:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ocurrió un error desconocido',
      );
    }
  },
);

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    updateSearchParams: (
      state,
      action: PayloadAction<Partial<ISearchParams>>,
    ) => {
      state.searchParams = {
        ...state.searchParams,
        ...action.payload,
      };
    },

    resetSearch: (state) => {
      state.searchParams = initialState.searchParams;
      state.displays = [];
      state.error = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.displays = action.payload.data;
          state.pagination = {
            total: action.payload.total,
            per_page: action.payload.per_page,
            current_page: action.payload.current_page,
            last_page: action.payload.last_page,
            from: action.payload.from,
            to: action.payload.to,
          };
        }
      })
      .addCase(searchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSearch, updateSearchParams } = campaignSlice.actions;

export default campaignSlice.reducer;

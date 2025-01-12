import { call, put, takeLatest, all } from 'redux-saga/effects';
import { fetchDisplays } from '../../services/api';
import { geocodeLocation } from '../../services/geocoding';
import {
  convertToPesos,
  fetchDollarBlue,
} from '../../services/convertionPrice';
import {
  fetchCampaignStart,
  fetchCampaignSuccess,
  fetchCampaignFailure,
} from './campaignSlice';
import { ICoordinates, ISearchParams } from '../../types';

function* fetchCampaignSaga(
  action: ReturnType<typeof fetchCampaignStart>,
): Generator<any, void, any> {
  try {
    let searchParams: ISearchParams = action.payload || {
      page: 1,
      per_page: 10,
      date_from: '',
      date_to: '',
      lat_sw: 0,
      lng_sw: 0,
      lat_ne: 0,
      lng_ne: 0,
    };

    if (searchParams.city) {
      const coordinates: ICoordinates = yield call(
        geocodeLocation,
        searchParams.city,
      );

      searchParams = {
        ...searchParams,
        lat_sw: coordinates.lat_sw,
        lng_sw: coordinates.lng_sw,
        lat_ne: coordinates.lat_ne,
        lng_ne: coordinates.lng_ne,
      };
    }

    const [response, dollarBlueRate] = yield all([
      call(fetchDisplays, searchParams),
      call(fetchDollarBlue),
    ]);

    const displaysInPesos = response.data.map((display: any) => ({
      ...display,
      price_converted:
        Math.ceil(convertToPesos(display.price_per_day, dollarBlueRate) / 100) *
        100,
    }));

    yield put(
      fetchCampaignSuccess({
        displays: displaysInPesos,
        pagination: {
          total: response.total,
          per_page: response.per_page,
          current_page: response.current_page,
          last_page: response.last_page,
          from: response.from,
          to: response.to,
        },
      }),
    );
  } catch (error) {
    yield put(
      fetchCampaignFailure(
        error instanceof Error ? error.message : 'Unknown error occurred',
      ),
    );
  }
}

export function* watchCampaignSaga() {
  yield takeLatest(fetchCampaignStart.type, fetchCampaignSaga);
}

export default function* campaignSaga() {
  yield all([watchCampaignSaga()]);
}

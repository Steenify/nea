import update from 'react-addons-update';
import { GROUND_SURVEILLANCE_LISTING_FILTER, GET_GROUND_SURVEILLANCE_LISTING } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    clusters: [],
    filteredClusters: [],
    lastThirdMonth: '',
    lastSecondMonth: '',
    lastMonth: '',
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUND_SURVEILLANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_GROUND_SURVEILLANCE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          lastThirdMonth: { $set: payload.lastThirdMonth || '' },
          lastSecondMonth: { $set: payload.lastSecondMonth || '' },
          lastMonth: { $set: payload.lastMonth || '' },
          clusters: { $set: payload.listOfResponseVO || [] },
          filteredClusters: { $set: payload.listOfResponseVO || [] },
        },
      });
    case GET_GROUND_SURVEILLANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case GROUND_SURVEILLANCE_LISTING_FILTER:
      return update(state, {
        data: {
          filteredClusters: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;

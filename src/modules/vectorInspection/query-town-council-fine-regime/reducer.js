import update from 'react-addons-update';
import { GET_QUERY_TOWN_COUNCIL_FINE_REGIME, FILTER_QUERY_TOWN_COUNCIL_FINE_REGIME } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_QUERY_TOWN_COUNCIL_FINE_REGIME.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_QUERY_TOWN_COUNCIL_FINE_REGIME.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case GET_QUERY_TOWN_COUNCIL_FINE_REGIME.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    case FILTER_QUERY_TOWN_COUNCIL_FINE_REGIME:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;

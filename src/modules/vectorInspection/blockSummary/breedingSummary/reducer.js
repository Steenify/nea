import update from 'react-addons-update';
import { GET_BREEDING_SUMMARY } from './action';

const defaultResponseData = {
  breedingSummary: [],
};
const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: defaultResponseData,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BREEDING_SUMMARY.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_BREEDING_SUMMARY.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: payload || defaultResponseData },
      });
    case GET_BREEDING_SUMMARY.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: defaultResponseData },
      });
    default:
      return state;
  }
};

export default reducer;

import update from 'react-addons-update';
import { SAMPLE_KPI_MONTHLY } from './action';

const defaultResponseData = [];
const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAMPLE_KPI_MONTHLY.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
        data: { $set: defaultResponseData },
      });
    case SAMPLE_KPI_MONTHLY.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: payload || defaultResponseData },
      });
    case SAMPLE_KPI_MONTHLY.ERROR:
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

import update from 'react-addons-update';
import { SAMPLE_KPI_MONTHLY_DETAIL } from '../action';

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
    case SAMPLE_KPI_MONTHLY_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
        data: { $set: defaultResponseData },
      });
    case SAMPLE_KPI_MONTHLY_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: payload || defaultResponseData },
      });
    case SAMPLE_KPI_MONTHLY_DETAIL.ERROR:
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

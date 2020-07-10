import update from 'react-addons-update';
import { OPS_CLOSE_OPERATION, OPS_DATA_TABLE, OPS_SEARCH } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    activeOps: [],
    summaryInspections: [],
    detail: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case OPS_DATA_TABLE.PENDING:
    case OPS_CLOSE_OPERATION.PENDING:
    case OPS_SEARCH.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case OPS_DATA_TABLE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          summaryInspections: { $set: payload },
        },
      });
    }
    case OPS_SEARCH.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          detail: { $set: payload },
        },
      });
    }
    case OPS_CLOSE_OPERATION.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case OPS_DATA_TABLE.ERROR:
    case OPS_CLOSE_OPERATION.ERROR:
    case OPS_SEARCH.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    default:
      return state;
  }
};

export default reducer;

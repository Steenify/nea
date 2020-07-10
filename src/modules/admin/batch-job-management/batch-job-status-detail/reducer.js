import update from 'react-addons-update';
import { BATCH_JOB_STATUS_CREATE, BATCH_JOB_STATUS_SEARCH, BATCH_JOB_STATUS_UPDATE, BATCH_JOB_STATUS_SEARCH_END_POINT } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
    endPointLOV: [],
    searchDetail: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case BATCH_JOB_STATUS_SEARCH.PENDING:
    case BATCH_JOB_STATUS_UPDATE.PENDING:
    case BATCH_JOB_STATUS_CREATE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case BATCH_JOB_STATUS_UPDATE.SUCCESS:
    case BATCH_JOB_STATUS_CREATE.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case BATCH_JOB_STATUS_SEARCH_END_POINT.SUCCESS: {
      return update(state, {
        data: {
          endPointLOV: { $set: payload },
        },
      });
    }
    case BATCH_JOB_STATUS_SEARCH.SUCCESS: {
      return update(state, {
        data: {
          searchDetail: { $set: payload },
        },
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case BATCH_JOB_STATUS_SEARCH.ERROR:
    case BATCH_JOB_STATUS_UPDATE.ERROR:
    case BATCH_JOB_STATUS_CREATE.ERROR:
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

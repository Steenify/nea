import update from 'react-addons-update';
import { BATCH_JOB_STATUS_DETAIL_LISTING, BATCH_JOB_STATUS_FILTER_DETAIL_LISTING } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    editingList: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case BATCH_JOB_STATUS_DETAIL_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case BATCH_JOB_STATUS_DETAIL_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: [...payload] },
          filteredList: { $set: [...payload] },
        },
      });
    case BATCH_JOB_STATUS_DETAIL_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case BATCH_JOB_STATUS_FILTER_DETAIL_LISTING:
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

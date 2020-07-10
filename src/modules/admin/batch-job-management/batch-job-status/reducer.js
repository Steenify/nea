import update from 'react-addons-update';
import { BATCH_JOB_STATUS_LISTING, BATCH_JOB_STATUS_FILTER_LISTING, BATCH_JOB_STATUS_DELETE, BATCH_JOB_STATUS_TERMINATE, BATCH_JOB_STATUS_TRIGGER } from './action';

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
    case BATCH_JOB_STATUS_DELETE.PENDING:
    case BATCH_JOB_STATUS_TERMINATE.PENDING:
    case BATCH_JOB_STATUS_LISTING.PENDING:
    case BATCH_JOB_STATUS_TRIGGER.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case BATCH_JOB_STATUS_LISTING.SUCCESS:
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
    case BATCH_JOB_STATUS_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case BATCH_JOB_STATUS_TRIGGER.SUCCESS:
    case BATCH_JOB_STATUS_TERMINATE.SUCCESS:
    case BATCH_JOB_STATUS_DELETE.ERROR:
    case BATCH_JOB_STATUS_TERMINATE.ERROR:
    case BATCH_JOB_STATUS_LISTING.ERROR:
    case BATCH_JOB_STATUS_TRIGGER.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case BATCH_JOB_STATUS_FILTER_LISTING:
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

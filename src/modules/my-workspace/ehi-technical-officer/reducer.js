import update from 'react-addons-update';
import { LISTING_ACTION, FILTER_ACTION, REJECT, SUPPORT } from './action';

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
    case REJECT.PENDING:
    case SUPPORT.PENDING:
    case LISTING_ACTION.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case LISTING_ACTION.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case LISTING_ACTION.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          taskList: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    case FILTER_ACTION:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case REJECT.SUCCESS:
    case SUPPORT.SUCCESS:
    case REJECT.ERROR:
    case SUPPORT.ERROR:
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

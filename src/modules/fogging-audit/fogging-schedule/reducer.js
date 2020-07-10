import update from 'react-addons-update';
import { GET_FOGGING_SCHEDULE_LIST, FILTER_FOGGING_SCHEDULE_LIST } from './action';

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

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case GET_FOGGING_SCHEDULE_LIST.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case GET_FOGGING_SCHEDULE_LIST.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case GET_FOGGING_SCHEDULE_LIST.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case FILTER_FOGGING_SCHEDULE_LIST: {
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    }
    default:
      return state;
  }
};

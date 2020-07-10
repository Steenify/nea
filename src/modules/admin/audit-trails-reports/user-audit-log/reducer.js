import update from 'react-addons-update';
import { USER_AUDIT_LOG_LIST_FILTER, USER_AUDIT_LOG_DOWNLOAD, USER_AUDIT_LOG_LIST } from './action';

export const initialState = {
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
    case USER_AUDIT_LOG_DOWNLOAD.PENDING:
    case USER_AUDIT_LOG_LIST_FILTER.PENDING:
    case USER_AUDIT_LOG_LIST.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case USER_AUDIT_LOG_LIST.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          filteredList: { $set: [...payload] },
        },
      });
    case USER_AUDIT_LOG_LIST_FILTER.SUCCESS:
    case USER_AUDIT_LOG_DOWNLOAD.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case USER_AUDIT_LOG_DOWNLOAD.ERROR:
    case USER_AUDIT_LOG_LIST.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    // case USER_AUDIT_LOG_LIST_FILTER:
    //   return update(state, {
    //     data: {
    //       filteredList: { $set: payload },
    //     },
    //   });
    default:
      return state;
  }
};

export default reducer;

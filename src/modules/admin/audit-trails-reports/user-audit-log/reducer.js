import update from 'react-addons-update';
import { USER_AUDIT_LOG_DOWNLOAD } from './action';

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
  const { type } = action;

  switch (type) {
    case USER_AUDIT_LOG_DOWNLOAD.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case USER_AUDIT_LOG_DOWNLOAD.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case USER_AUDIT_LOG_DOWNLOAD.ERROR:
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

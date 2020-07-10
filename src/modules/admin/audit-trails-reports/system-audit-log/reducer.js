import update from 'react-addons-update';
import { SYSTEM_AUDIT_LOG_LIST_FILTER, SYSTEM_AUDIT_LOG_DOWNLOAD, SYSTEM_AUDIT_LOG_LIST, SYSTEM_AUDIT_LOG_SYS_CONFIG } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
    sysConfig: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SYSTEM_AUDIT_LOG_SYS_CONFIG.PENDING:
    case SYSTEM_AUDIT_LOG_DOWNLOAD.PENDING:
    case SYSTEM_AUDIT_LOG_LIST.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case SYSTEM_AUDIT_LOG_LIST.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          filteredList: { $set: [...payload] },
        },
      });
    case SYSTEM_AUDIT_LOG_DOWNLOAD.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case SYSTEM_AUDIT_LOG_SYS_CONFIG.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          sysConfig: { $set: payload },
        },
      });
    }
    case SYSTEM_AUDIT_LOG_SYS_CONFIG.ERROR:
    case SYSTEM_AUDIT_LOG_DOWNLOAD.ERROR:
    case SYSTEM_AUDIT_LOG_LIST.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case SYSTEM_AUDIT_LOG_LIST_FILTER:
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

import update from 'react-addons-update';
import { NOTICE_OF_ENTRY_DOWNLOAD, VIEW_APPROVED_NOTICE, FILTER_ACTION } from './action';

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
    case VIEW_APPROVED_NOTICE.PENDING:
    case NOTICE_OF_ENTRY_DOWNLOAD.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case VIEW_APPROVED_NOTICE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    }
    case FILTER_ACTION:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case VIEW_APPROVED_NOTICE.ERROR:
    case NOTICE_OF_ENTRY_DOWNLOAD.SUCCESS:
    case NOTICE_OF_ENTRY_DOWNLOAD.ERROR:
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

import update from 'react-addons-update';
import { GET_BLOCK_SUMMARY_DETAIL, DOWNLOAD_NOTICE } from './action';

const defaultResponse = {
  inspectionDetails: [],
};

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: defaultResponse,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BLOCK_SUMMARY_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_BLOCK_SUMMARY_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: payload },
      });
    case GET_BLOCK_SUMMARY_DETAIL.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { $set: defaultResponse },
      });
    case DOWNLOAD_NOTICE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case DOWNLOAD_NOTICE.SUCCESS:
    case DOWNLOAD_NOTICE.ERROR:
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

import update from 'react-addons-update';
import { COMMON_UPLOAD, SHOW_COMMON_UPLOAD, RESET_COMMON_UPLOAD } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    functionLOV: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_COMMON_UPLOAD: {
      return update(state, {
        data: {
          functionLOV: { $set: null },
        },
      });
    }
    case SHOW_COMMON_UPLOAD.PENDING:
    case COMMON_UPLOAD.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case COMMON_UPLOAD.SUCCESS:
    case COMMON_UPLOAD.ERROR:
    case SHOW_COMMON_UPLOAD.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case SHOW_COMMON_UPLOAD.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          functionLOV: { $set: payload },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;

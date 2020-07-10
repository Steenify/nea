import update from 'react-addons-update';
import { LISTING, SAVE, DELETE_BY_ID, DELETE_ALL, UPLOAD_LAPSE, LAPSE_LISTING } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    list: [],
    lapseLOV: [],
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LAPSE_LISTING.PENDING:
    case LISTING.PENDING:
    case SAVE.PENDING:
    case DELETE_BY_ID.PENDING:
    case UPLOAD_LAPSE.PENDING:
    case DELETE_ALL.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
        },
      });
    }
    case LAPSE_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          lapseLOV: { $set: payload },
        },
      });
    }
    case SAVE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case DELETE_BY_ID.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case DELETE_ALL.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case LAPSE_LISTING.ERROR:
    case UPLOAD_LAPSE.SUCCESS:
    case UPLOAD_LAPSE.ERROR:
    case LISTING.ERROR:
    case SAVE.ERROR:
    case DELETE_BY_ID.ERROR:
    case DELETE_ALL.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    default:
      return { ...state };
  }
};

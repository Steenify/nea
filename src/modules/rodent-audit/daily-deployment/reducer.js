import update from 'react-addons-update';
import { RODENT_AUDIT_DAILY_DEPLOYMENT_FILTER, DAILY_DEVELOPMENT_LISTING, UPLOAD_DAILY_DEVELOPMENT } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case DAILY_DEVELOPMENT_LISTING.PENDING:
    case UPLOAD_DAILY_DEVELOPMENT.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case DAILY_DEVELOPMENT_LISTING.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: { list: { $set: payload }, filteredList: { $set: payload } },
      });
    }
    case UPLOAD_DAILY_DEVELOPMENT.SUCCESS:
    case DAILY_DEVELOPMENT_LISTING.ERROR:
    case UPLOAD_DAILY_DEVELOPMENT.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case RODENT_AUDIT_DAILY_DEPLOYMENT_FILTER: {
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

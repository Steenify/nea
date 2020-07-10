import update from 'react-addons-update';
import { RODENT_AUDIT_DAILY_REPORT_FILTER, DAILY_REPORT_LISTING, UPLOAD_DAILY_REPORT } from './action';

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
    case DAILY_REPORT_LISTING.PENDING:
    case UPLOAD_DAILY_REPORT.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case DAILY_REPORT_LISTING.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    }
    case UPLOAD_DAILY_REPORT.SUCCESS: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case DAILY_REPORT_LISTING.ERROR:
    case UPLOAD_DAILY_REPORT.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case RODENT_AUDIT_DAILY_REPORT_FILTER: {
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

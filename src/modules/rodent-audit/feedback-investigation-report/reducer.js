import update from 'react-addons-update';
import { RODENT_AUDIT_FEEDBACK_INVESTIGATION_FILTER, FEEDBACK_REPORT_LISTING, UPLOAD_RODENT_FEEDBACK } from './action';

const initialState = {
  ui: { isLoading: false },
  data: { list: [], filteredList: [] },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FEEDBACK_REPORT_LISTING.PENDING:
    case UPLOAD_RODENT_FEEDBACK.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case FEEDBACK_REPORT_LISTING.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    }
    case UPLOAD_RODENT_FEEDBACK.SUCCESS: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case FEEDBACK_REPORT_LISTING.ERROR:
    case UPLOAD_RODENT_FEEDBACK.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case RODENT_AUDIT_FEEDBACK_INVESTIGATION_FILTER: {
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

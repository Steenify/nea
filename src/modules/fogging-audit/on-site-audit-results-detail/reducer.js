import update from 'react-addons-update';
import {
  FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL,
  FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE,
  FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL_FILTER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
    detail: null,
    matchingAuditTask: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // case FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.PENDING:
    case FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.PENDING:
    case FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.SUCCESS: {
      const matchingFoggingSchedules = payload?.matchingFoggingSchedules || [];
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          detail: { $set: payload },
          matchingAuditTask: { $set: payload.matchingAuditTask },
          list: { $set: matchingFoggingSchedules },
          filteredList: { $set: [payload.matchingAuditTask, ...matchingFoggingSchedules] },
        },
      });
    }
    case FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.ERROR:
    case FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL_FILTER:
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

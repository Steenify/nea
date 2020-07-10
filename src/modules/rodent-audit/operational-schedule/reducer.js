import update from 'react-addons-update';
import { RODENT_AUDIT_OPERATIONAL_SCHEDULE_FILTER, OPS_SCHEDULE_LISTING, UPLOAD_RODENT_OPERATIONAL_SCHEDULES } from './action';

const initialState = {
  ui: { isLoading: false, errorMessage: null },
  data: { list: [], filteredList: [] },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_RODENT_OPERATIONAL_SCHEDULES.PENDING:
    case OPS_SCHEDULE_LISTING.PENDING: {
      return update(state, {
        ui: { isLoading: { $set: true } },
      });
    }
    case OPS_SCHEDULE_LISTING.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: { list: { $set: payload }, filteredList: { $set: payload } },
      });
    }
    case UPLOAD_RODENT_OPERATIONAL_SCHEDULES.SUCCESS: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case UPLOAD_RODENT_OPERATIONAL_SCHEDULES.ERROR:
    case OPS_SCHEDULE_LISTING.ERROR: {
      return update(state, {
        ui: { isLoading: { $set: false } },
      });
    }
    case RODENT_AUDIT_OPERATIONAL_SCHEDULE_FILTER: {
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

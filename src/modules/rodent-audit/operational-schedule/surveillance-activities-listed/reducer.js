import update from 'react-addons-update';
import { RODENT_AUDIT_OPERATIONAL_SCHEDULES_INFO_FILTER, QUERY_OPERATIONAL_SCHEDULES_INFO } from './action';

const initialState = {
  ui: { isLoading: false },
  data: { list: [], filteredList: [] },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case QUERY_OPERATIONAL_SCHEDULES_INFO.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case QUERY_OPERATIONAL_SCHEDULES_INFO.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    }
    case QUERY_OPERATIONAL_SCHEDULES_INFO.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case RODENT_AUDIT_OPERATIONAL_SCHEDULES_INFO_FILTER: {
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

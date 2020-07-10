import update from 'react-addons-update';
import { MANPOWER_LIST_INFO, RODENT_AUDIT_FILTER } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case MANPOWER_LIST_INFO.PENDING: {
      return update(state, { ui: { isLoading: { $set: true } } });
    }
    case MANPOWER_LIST_INFO.SUCCESS: {
      return update(state, {
        ui: { isLoading: { $set: false } },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    }
    case MANPOWER_LIST_INFO.ERROR: {
      return update(state, { ui: { isLoading: { $set: false } } });
    }
    case RODENT_AUDIT_FILTER: {
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

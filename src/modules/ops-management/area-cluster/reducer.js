import update from 'react-addons-update';
import { ACTIVE_OPS_FOR_USER_LISTING, ALL_ACTIVE_OPS_LISTING, ACTIVE_OPS_SEARCH_CLUSTER, ACTIVE_OPS_SG, ACTIVE_OPS_RESET } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    activeOpsForUser: [],
    allActiveOps: [],
    searchActiveOps: [],
    activeOpsSG: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIVE_OPS_RESET:
      return initialState;
    case ACTIVE_OPS_SEARCH_CLUSTER.PENDING:
    case ACTIVE_OPS_SG.PENDING:
    case ACTIVE_OPS_FOR_USER_LISTING.PENDING:
    case ALL_ACTIVE_OPS_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case ACTIVE_OPS_FOR_USER_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          activeOpsForUser: { $set: [...payload] },
        },
      });
    case ALL_ACTIVE_OPS_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          allActiveOps: { $set: [...payload] },
        },
      });
    }
    case ACTIVE_OPS_SG.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          activeOpsSG: { $set: [...payload] },
        },
      });
    }
    case ACTIVE_OPS_SEARCH_CLUSTER.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          searchActiveOps: { $set: [...payload] },
        },
      });
    }
    case ACTIVE_OPS_SEARCH_CLUSTER.ERROR:
    case ACTIVE_OPS_FOR_USER_LISTING.ERROR:
    case ACTIVE_OPS_SG.ERROR:
    case ALL_ACTIVE_OPS_LISTING.ERROR:
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

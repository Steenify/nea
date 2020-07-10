import update from 'react-addons-update';
import {
  TOWN_COUNCIL_FINE_REGIME_DETAIL,
  TOWN_COUNCIL_FINE_REGIME_SUMMARY,
  CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY,
  SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL,
  REJECT_TOWN_COUNCIL_FINE_REGIME,
  SUPPORT_TOWN_COUNCIL_FINE_REGIME,
  APPROVE_TOWN_COUNCIL_FINE_REGIME,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
    summary: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case APPROVE_TOWN_COUNCIL_FINE_REGIME.PENDING:
    case SUPPORT_TOWN_COUNCIL_FINE_REGIME.PENDING:
    case REJECT_TOWN_COUNCIL_FINE_REGIME.PENDING:
    case SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.PENDING:
    case TOWN_COUNCIL_FINE_REGIME_SUMMARY.PENDING:
    case CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.PENDING:
    case TOWN_COUNCIL_FINE_REGIME_DETAIL.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case APPROVE_TOWN_COUNCIL_FINE_REGIME.ERROR:
    case SUPPORT_TOWN_COUNCIL_FINE_REGIME.ERROR:
    case REJECT_TOWN_COUNCIL_FINE_REGIME.ERROR:
    case SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.ERROR:
    case TOWN_COUNCIL_FINE_REGIME_SUMMARY.ERROR:
    case CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.ERROR:
    case TOWN_COUNCIL_FINE_REGIME_DETAIL.ERROR: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case TOWN_COUNCIL_FINE_REGIME_DETAIL.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          detail: { $set: payload },
        },
      });
    }
    case TOWN_COUNCIL_FINE_REGIME_SUMMARY.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          summary: { $set: payload },
        },
      });
    }
    case APPROVE_TOWN_COUNCIL_FINE_REGIME.SUCCESS:
    case SUPPORT_TOWN_COUNCIL_FINE_REGIME.SUCCESS:
    case REJECT_TOWN_COUNCIL_FINE_REGIME.SUCCESS:
    case SAVE_TOWN_COUNCIL_FINE_REGIME_DETAIL.SUCCESS:
    case CONFIRM_TOWN_COUNCIL_FINE_REGIME_SUMMARY.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;

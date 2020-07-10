import update from 'react-addons-update';
import { EWEEK_MAINTENANCE_GENERATE, EWEEK_MAINTENANCE_CONFIRM, EWEEK_MAINTENANCE_RESET_REDUCER, EWEEK_MAINTENANCE_PREVIOUS_YEAR } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    isGenerated: false,
  },
  data: {
    previousYear: undefined,
    eweekVoList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EWEEK_MAINTENANCE_PREVIOUS_YEAR.PENDING:
    case EWEEK_MAINTENANCE_GENERATE.PENDING:
    case EWEEK_MAINTENANCE_CONFIRM.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EWEEK_MAINTENANCE_GENERATE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          isGenerated: { $set: true },
        },
        data: {
          eweekVoList: { $set: payload },
        },
      });
    }
    case EWEEK_MAINTENANCE_CONFIRM.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
          isGenerated: { $set: false },
        },
      });
    }
    case EWEEK_MAINTENANCE_PREVIOUS_YEAR.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          previousYear: { $set: payload },
        },
      });
    }
    case EWEEK_MAINTENANCE_PREVIOUS_YEAR.ERROR:
    case EWEEK_MAINTENANCE_GENERATE.ERROR:
    case EWEEK_MAINTENANCE_CONFIRM.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case EWEEK_MAINTENANCE_RESET_REDUCER:
      return initialState;
    default:
      return state;
  }
};

export default reducer;

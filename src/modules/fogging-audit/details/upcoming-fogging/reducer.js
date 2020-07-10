import update from 'react-addons-update';
import { FOGGING_AUDIT_AD_HOC_UPCOMING } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FOGGING_AUDIT_AD_HOC_UPCOMING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case FOGGING_AUDIT_AD_HOC_UPCOMING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          detail: { $set: payload },
        },
      });
    case FOGGING_AUDIT_AD_HOC_UPCOMING.ERROR:
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

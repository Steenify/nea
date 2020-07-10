import update from 'react-addons-update';
import { FOGGING_AUDIT_AD_HOC, FOGGING_AUDIT_AD_HOC_FILTER } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FOGGING_AUDIT_AD_HOC.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case FOGGING_AUDIT_AD_HOC.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case FOGGING_AUDIT_AD_HOC.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case FOGGING_AUDIT_AD_HOC_FILTER:
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

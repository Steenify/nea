import update from 'react-addons-update';
import { GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST, SEND_TC_APPROVED_FORM3_TO_EEMS2 } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEND_TC_APPROVED_FORM3_TO_EEMS2.PENDING:
    case GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case SEND_TC_APPROVED_FORM3_TO_EEMS2.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
        },
      });
    case SEND_TC_APPROVED_FORM3_TO_EEMS2.ERROR:
    case GET_TOWN_COUNCIL_FINE_REGIME_APPROVED_TC_FORM_3_LIST.ERROR:
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

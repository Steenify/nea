import update from 'react-addons-update';
import { DETAIL, SUBMIT, CONCUR, REJECT, AD_HOC_SUBMIT, RESET_REDUCER } from './action';
import { initialCaseDetail } from './helper';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    caseDetail: initialCaseDetail,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AD_HOC_SUBMIT.PENDING:
    case REJECT.PENDING:
    case CONCUR.PENDING:
    case SUBMIT.PENDING:
    case DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          caseDetail: { $set: payload },
        },
      });
    case AD_HOC_SUBMIT.ERROR:
    case AD_HOC_SUBMIT.SUCCESS:
    case REJECT.ERROR:
    case REJECT.SUCCESS:
    case CONCUR.ERROR:
    case CONCUR.SUCCESS:
    case SUBMIT.ERROR:
    case SUBMIT.SUCCESS:
    case DETAIL.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case RESET_REDUCER:
      return initialState;
    default:
      return state;
  }
};

export default reducer;

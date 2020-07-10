import update from 'react-addons-update';
import { EPI_INVESTIGATION_CASE_DETAIL, GET_ADDRESS, EPI_INVESTIGATION_CASE_SUBMIT, RESET_REDUCER } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    caseInfo: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EPI_INVESTIGATION_CASE_SUBMIT.PENDING:
    case GET_ADDRESS.PENDING:
    case EPI_INVESTIGATION_CASE_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EPI_INVESTIGATION_CASE_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          caseInfo: { $set: payload },
        },
      });
    case EPI_INVESTIGATION_CASE_SUBMIT.SUCCESS:
    case EPI_INVESTIGATION_CASE_SUBMIT.ERROR:
    case GET_ADDRESS.SUCCESS:
    case GET_ADDRESS.ERROR:
    case EPI_INVESTIGATION_CASE_DETAIL.ERROR:
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

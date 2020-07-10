import update from 'react-addons-update';
import { EPI_INSPECTOR_CLAIM_TASK, EPI_INSPECTOR_CLAIM_TASK_FILTER, EPI_INSPECTOR_CASE_CLAIM } from './action';

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
    case EPI_INSPECTOR_CASE_CLAIM.PENDING:
    case EPI_INSPECTOR_CLAIM_TASK.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EPI_INSPECTOR_CLAIM_TASK.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case EPI_INSPECTOR_CASE_CLAIM.SUCCESS:
    case EPI_INSPECTOR_CASE_CLAIM.ERROR:
    case EPI_INSPECTOR_CLAIM_TASK.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case EPI_INSPECTOR_CLAIM_TASK_FILTER:
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

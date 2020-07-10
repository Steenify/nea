import update from 'react-addons-update';
import { EPI_COB1_CLAIM_TASK, EPI_COB1_CLAIM_TASK_FILTER, EPI_COB1_CASE_CLAIM } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
    tabCount: [0, 0, 0, 0, 0, 0],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EPI_COB1_CASE_CLAIM.PENDING:
    case EPI_COB1_CLAIM_TASK.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EPI_COB1_CLAIM_TASK.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload.list },
          filteredList: { $set: payload.list },
          tabCount: { $set: payload.tabCount },
        },
      });
    case EPI_COB1_CASE_CLAIM.ERROR:
    case EPI_COB1_CASE_CLAIM.SUCCESS:
    case EPI_COB1_CLAIM_TASK.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case EPI_COB1_CLAIM_TASK_FILTER:
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

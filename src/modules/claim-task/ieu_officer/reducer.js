import update from 'react-addons-update';
import {
  CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING,
  CLAIM_TASK_IEU_OFFICER_FILTER,
  CLAIM_TASK_IEU_OFFICER_CLAIM,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    taskList: [],
    filteredTaskList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CLAIM_TASK_IEU_OFFICER_CLAIM.PENDING:
    case CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          taskList: { $set: payload },
          filteredTaskList: { $set: payload },
        },
      });
    case CLAIM_TASK_IEU_OFFICER_CLAIM.SUCCESS:
    case CLAIM_TASK_IEU_OFFICER_CLAIM.ERROR:
    case CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          taskList: { $set: [] },
        },
      });
    case CLAIM_TASK_IEU_OFFICER_FILTER:
      return update(state, {
        data: {
          filteredTaskList: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;

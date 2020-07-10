import update from 'react-addons-update';
import {
  ROLE_FUNCTION_MAPPING_CREATE,
  ROLE_FUNCTION_MAPPING_UPDATE,
  ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS,
  ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
    assignedFunctions: [],
    nonAssignedFunctions: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.PENDING:
    case ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.PENDING:
    case ROLE_FUNCTION_MAPPING_UPDATE.PENDING:
    case ROLE_FUNCTION_MAPPING_CREATE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case ROLE_FUNCTION_MAPPING_UPDATE.SUCCESS:
    case ROLE_FUNCTION_MAPPING_CREATE.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          nonAssignedFunctions: { $set: payload },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          assignedFunctions: { $set: payload },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.ERROR:
    case ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.ERROR:
    case ROLE_FUNCTION_MAPPING_UPDATE.ERROR:
    case ROLE_FUNCTION_MAPPING_CREATE.ERROR:
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

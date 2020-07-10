import update from 'react-addons-update';
import { OPS_GET_ADDITIONAL_INFO, OPS_UPDATE_ADDITIONAL_INFO, OPS_RESET_ADDITIONAL_INFO } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    operationsInfoVOList: [],
    operationsGravitrapInfoVOList: [],
    operationsInitiativeVOList: [],
    operationsTreatList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case OPS_UPDATE_ADDITIONAL_INFO.PENDING:
    case OPS_GET_ADDITIONAL_INFO.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case OPS_UPDATE_ADDITIONAL_INFO.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case OPS_GET_ADDITIONAL_INFO.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          operationsInfoVOList: { $set: payload.OperationsInfoVOList },
          operationsGravitrapInfoVOList: { $set: payload.OperationsGravitrapInfoVOList },
          operationsInitiativeVOList: { $set: payload.OperationsInitiativeVOList },
          operationsTreatList: { $set: payload.OperationsTreatList },
        },
      });
    case OPS_UPDATE_ADDITIONAL_INFO.ERROR:
    case OPS_GET_ADDITIONAL_INFO.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case OPS_RESET_ADDITIONAL_INFO:
      return initialState;
    default:
      return state;
  }
};

export default reducer;

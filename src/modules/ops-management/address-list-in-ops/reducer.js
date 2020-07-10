import update from 'react-addons-update';
import { OPS_LIST_ADDRESS, OPS_SUBMIT_LIST_ADDRESS, OPS_LIST_ADDRESS_POSTAL_CODE } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    initialAddressList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case OPS_LIST_ADDRESS_POSTAL_CODE.PENDING:
    case OPS_SUBMIT_LIST_ADDRESS.PENDING:
    case OPS_LIST_ADDRESS.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case OPS_LIST_ADDRESS_POSTAL_CODE.SUCCESS:
    case OPS_SUBMIT_LIST_ADDRESS.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case OPS_LIST_ADDRESS.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          initialAddressList: { $set: payload || [] },
        },
      });
    case OPS_LIST_ADDRESS_POSTAL_CODE.ERROR:
    case OPS_SUBMIT_LIST_ADDRESS.ERROR:
    case OPS_LIST_ADDRESS.ERROR:
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

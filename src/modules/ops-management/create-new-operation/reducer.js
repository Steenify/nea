import update from 'react-addons-update';
import { OPS_CREATE_ADHOC, OPS_SEARCH_ADDRESS_BY_POSTAL_CODE, OPS_UPDATE_ADHOC } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    initialAddressList: [],
    opsCreationDate: '',
    userVO: {},
    retrievedAddress: undefined,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.PENDING:
    case OPS_UPDATE_ADHOC.PENDING:
    case OPS_CREATE_ADHOC.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case OPS_CREATE_ADHOC.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          initialAddressList: { $set: payload.sgAddressList || [] },
          opsCreationDate: { $set: payload.opsCreationDate },
          userVO: { $set: payload.userVO },
        },
      });
    case OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          retrievedAddress: { $set: payload },
        },
      });
    }
    case OPS_UPDATE_ADHOC.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case OPS_SEARCH_ADDRESS_BY_POSTAL_CODE.ERROR:
    case OPS_CREATE_ADHOC.ERROR:
    case OPS_UPDATE_ADHOC.ERROR:
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

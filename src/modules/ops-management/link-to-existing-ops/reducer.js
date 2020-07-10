import update from 'react-addons-update';
import { EXISTING_OPERATIONS, LINK_EXISTING_OPERATIONS } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    activeOps: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LINK_EXISTING_OPERATIONS.PENDING:
    case EXISTING_OPERATIONS.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EXISTING_OPERATIONS.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          activeOps: { $set: [...payload] },
        },
      });
    case LINK_EXISTING_OPERATIONS.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case LINK_EXISTING_OPERATIONS.ERROR:
    case EXISTING_OPERATIONS.ERROR:
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

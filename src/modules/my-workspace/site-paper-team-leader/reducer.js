import update from 'react-addons-update';
import { CHANGE_LD_STATUS } from './action';

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
  const { type } = action;

  switch (type) {
    case CHANGE_LD_STATUS.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });

    case CHANGE_LD_STATUS.SUCCESS:
    case CHANGE_LD_STATUS.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    default:
      return state;
  }
};

export default reducer;

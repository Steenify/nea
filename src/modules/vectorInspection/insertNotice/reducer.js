import update from 'react-addons-update';
import { INSERT_NOTICE } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case INSERT_NOTICE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case INSERT_NOTICE.ERROR:
    case INSERT_NOTICE.SUCCESS:
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

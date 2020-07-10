import update from 'react-addons-update';
import { ENFORCE_S35 } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ENFORCE_S35.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case ENFORCE_S35.ERROR:
    case ENFORCE_S35.SUCCESS:
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

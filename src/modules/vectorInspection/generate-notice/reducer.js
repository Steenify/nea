import update from 'react-addons-update';
import { GENERATE_NOTICE, PREVIEW_NOTICE } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case PREVIEW_NOTICE.PENDING:
    case GENERATE_NOTICE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case PREVIEW_NOTICE.ERROR:
    case PREVIEW_NOTICE.SUCCESS:
    case GENERATE_NOTICE.ERROR:
    case GENERATE_NOTICE.SUCCESS:
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

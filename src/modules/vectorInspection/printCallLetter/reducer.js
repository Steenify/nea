import update from 'react-addons-update';
import { PRINT_CALL_LETTER_GENERATE, DOWNLOAD } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case DOWNLOAD.PENDING:
    case PRINT_CALL_LETTER_GENERATE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });

    case DOWNLOAD.SUCCESS:
    case DOWNLOAD.ERROR:
    case PRINT_CALL_LETTER_GENERATE.SUCCESS:
    case PRINT_CALL_LETTER_GENERATE.ERROR:
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

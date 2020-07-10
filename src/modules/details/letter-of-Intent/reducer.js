import update from 'react-addons-update';
import { LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST, LETTER_OF_INTENT_CREATE } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    letterList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.PENDING:
    case LETTER_OF_INTENT_CREATE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          letterList: { $set: payload },
        },
      });
    case LETTER_OF_INTENT_GET_PAST_12_MONTHS_LIST.ERROR:
    case LETTER_OF_INTENT_CREATE.ERROR:
    case LETTER_OF_INTENT_CREATE.SUCCESS:
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

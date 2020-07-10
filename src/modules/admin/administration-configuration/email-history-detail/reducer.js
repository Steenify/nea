import update from 'react-addons-update';

import { GET_EMAIL_HISTORY_DETAIL } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    emailHostory: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EMAIL_HISTORY_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_EMAIL_HISTORY_DETAIL.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          emailHostory: { $set: payload },
        },
      });
    }
    case GET_EMAIL_HISTORY_DETAIL.ERROR:
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

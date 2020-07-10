import update from 'react-addons-update';

import { GET_NOTIFICATION_HISTORY_DETAIL } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {
    history: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATION_HISTORY_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_NOTIFICATION_HISTORY_DETAIL.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          history: { $set: payload },
        },
      });
    }
    case GET_NOTIFICATION_HISTORY_DETAIL.ERROR:
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

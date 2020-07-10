import update from 'react-addons-update';
import { WIDGET_BY_ROLE_SAVE } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
  },
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case WIDGET_BY_ROLE_SAVE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case WIDGET_BY_ROLE_SAVE.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case WIDGET_BY_ROLE_SAVE.ERROR:
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

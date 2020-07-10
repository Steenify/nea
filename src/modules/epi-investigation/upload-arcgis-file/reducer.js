import update from 'react-addons-update';
import { CASE_UPLOAD } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {},
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CASE_UPLOAD.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case CASE_UPLOAD.ERROR:
    case CASE_UPLOAD.SUCCESS:
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

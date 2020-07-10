import update from 'react-addons-update';
import { PCO_UPLOAD } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: {},
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case PCO_UPLOAD.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case PCO_UPLOAD.ERROR:
    case PCO_UPLOAD.SUCCESS:
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

import update from 'react-addons-update';
import { LISTING, DOWNLOAD } from './action';

const initialState = {
  ui: {
    isLoading: false,
  },
  data: { list: [] },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case DOWNLOAD.PENDING:
    case LISTING.PENDING: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    }
    case LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: { list: { $set: payload } },
      });
    case DOWNLOAD.SUCCESS:
    case DOWNLOAD.ERROR:
    case LISTING.ERROR:
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

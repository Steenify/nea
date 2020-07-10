import update from 'react-addons-update';
import { EDIT_SOF_LISTING, EDIT_SOF_LISTING_FILTER } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EDIT_SOF_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EDIT_SOF_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case EDIT_SOF_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case EDIT_SOF_LISTING_FILTER:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;

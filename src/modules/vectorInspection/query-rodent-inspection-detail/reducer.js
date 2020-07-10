import update from 'react-addons-update';
import { GET_RODENT_INSPECTION_DETAIL } from './action';

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
    case GET_RODENT_INSPECTION_DETAIL.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_RODENT_INSPECTION_DETAIL.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case GET_RODENT_INSPECTION_DETAIL.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    default:
      return state;
  }
};

export default reducer;

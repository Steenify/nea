import update from 'react-addons-update';
import { RODENT_AUDIT_MANPOWER_LISTING, RODENT_AUDIT_MANPOWER_FILTER, UPLOAD_ROD_CONTRACT_MANPOWER_LIST } from './action';

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
    case UPLOAD_ROD_CONTRACT_MANPOWER_LIST.PENDING:
    case RODENT_AUDIT_MANPOWER_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case RODENT_AUDIT_MANPOWER_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          filteredList: { $set: payload },
        },
      });
    case UPLOAD_ROD_CONTRACT_MANPOWER_LIST.SUCCESS:
    case UPLOAD_ROD_CONTRACT_MANPOWER_LIST.ERROR:
    case RODENT_AUDIT_MANPOWER_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case RODENT_AUDIT_MANPOWER_FILTER:
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

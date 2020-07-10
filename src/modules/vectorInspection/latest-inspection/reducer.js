import update from 'react-addons-update';
import { LATEST_INSPECTION_LISTING_FILTER, GET_LATEST_INSPECTION_LISTING, SET_DEFAULT_VALUE } from './action';

export const defaultValue = {
  searchText: '',
  searchType: 'roadName',
  filterValue: {
    division: [],
    regionOffice: [],
    premisesType: [],
  },
  premiseType: 'BLOCK',
  sortValue: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
};

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    list: [],
    filteredList: [],
    defaultValue,
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_LATEST_INSPECTION_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_LATEST_INSPECTION_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: payload },
          // filteredList: { $set: payload },
        },
      });
    case GET_LATEST_INSPECTION_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [] },
          filteredList: { $set: [] },
        },
      });
    case LATEST_INSPECTION_LISTING_FILTER:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case SET_DEFAULT_VALUE:
      return update(state, {
        data: {
          defaultValue: { $merge: payload },
        },
      });
    default:
      return state;
  }
};

export default reducer;

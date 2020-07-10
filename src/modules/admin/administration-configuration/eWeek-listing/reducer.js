import update from 'react-addons-update';
import { EWEEK_MAINTENANCE_LISTING, EWEEK_MAINTENANCE_UPDATE_FILTER, EWEEK_MAINTENANCE_FILTER_LISTING, EWEEK_MAINTENANCE_RESET_REDUCER } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'year',
        label: 'Year',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'year',
    },
  },
  data: {
    list: [],
    editingList: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case EWEEK_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case EWEEK_MAINTENANCE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
        },
      });
    case EWEEK_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case EWEEK_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case EWEEK_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case EWEEK_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

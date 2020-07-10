import update from 'react-addons-update';
import { WIDGET_BY_ROLE_LISTING, WIDGET_BY_ROLE_ASSIGNED_LISTING, WIDGET_BY_ROLE_UPDATE_FILTER, WIDGET_BY_ROLE_FILTER_LISTING, WIDGET_BY_ROLE_DELETE, WIDGET_BY_ROLE_RESET_REDUCER } from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'roleName',
        label: 'Role Name',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'roleName',
    },
  },
  data: {
    list: [],
    filteredList: [],
    assignedList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case WIDGET_BY_ROLE_DELETE.PENDING:
    case WIDGET_BY_ROLE_LISTING.PENDING:
    case WIDGET_BY_ROLE_ASSIGNED_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case WIDGET_BY_ROLE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          filteredList: { $set: [...payload] },
        },
      });
    case WIDGET_BY_ROLE_ASSIGNED_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          assignedList: { $set: [...payload] },
        },
      });
    }
    case WIDGET_BY_ROLE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    }
    case WIDGET_BY_ROLE_DELETE.ERROR:
    case WIDGET_BY_ROLE_LISTING.ERROR:
    case WIDGET_BY_ROLE_ASSIGNED_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case WIDGET_BY_ROLE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case WIDGET_BY_ROLE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case WIDGET_BY_ROLE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

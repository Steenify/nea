import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  HOLIDAY_MAINTENANCE_LISTING,
  HOLIDAY_MAINTENANCE_UPDATE_FILTER,
  HOLIDAY_MAINTENANCE_FILTER_LISTING,
  HOLIDAY_MAINTENANCE_CREATE,
  HOLIDAY_MAINTENANCE_UPDATE,
  HOLIDAY_MAINTENANCE_DELETE,
  HOLIDAY_MAINTENANCE_EDIT,
  HOLIDAY_MAINTENANCE_CANCEL_EDITING,
  HOLIDAY_MAINTENANCE_ADD,
  HOLIDAY_MAINTENANCE_REMOVE_ADD,
  HOLIDAY_MAINTENANCE_SET_VALUE,
  HOLIDAY_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'holidayDate',
        label: 'Date',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'holidayDescription',
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
    case HOLIDAY_MAINTENANCE_CREATE.PENDING:
    case HOLIDAY_MAINTENANCE_UPDATE.PENDING:
    case HOLIDAY_MAINTENANCE_DELETE.PENDING:
    case HOLIDAY_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case HOLIDAY_MAINTENANCE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: _.unionBy(state.data.editingList, payload, 'id') },
          filteredList: { $set: _.unionBy(state.data.filteredList, payload, 'id') },
        },
      });
    case HOLIDAY_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.id === payload.oldId);
      const newState = {
        ui: {
          isLoading: { $set: false },
        },
      };
      if (index > -1) {
        newState.data = {
          editingList: {
            [index]: {
              action: { $set: undefined },
              id: { $set: payload.newId },
            },
          },
        };
      }
      return update(state, newState);
    }

    case HOLIDAY_MAINTENANCE_UPDATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.id === payload);
      const newState = {
        ui: {
          isLoading: { $set: false },
        },
      };
      if (index > -1) {
        newState.data = {
          editingList: {
            [index]: {
              action: {
                $set: undefined,
              },
            },
          },
        };
      }
      return update(state, newState);
    }
    case HOLIDAY_MAINTENANCE_CREATE.ERROR:
    case HOLIDAY_MAINTENANCE_UPDATE.ERROR:
    case HOLIDAY_MAINTENANCE_DELETE.ERROR:
    case HOLIDAY_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case HOLIDAY_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case HOLIDAY_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_EDIT: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.id === payload);
      if (index < 0) {
        return state;
      }
      return update(state, {
        data: {
          editingList: {
            [index]: {
              action: {
                $set: 'edit',
              },
            },
          },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_SET_VALUE: {
      const { name, value, id } = payload;
      const index = state.data.editingList.findIndex((item) => item.id === id);
      if (index < 0) {
        return state;
      }
      return update(state, {
        data: {
          editingList: {
            [index]: {
              [name]: {
                $set: value,
              },
            },
          },
        },
      });
    }
    case HOLIDAY_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

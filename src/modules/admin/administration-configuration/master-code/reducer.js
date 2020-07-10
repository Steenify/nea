import update from 'react-addons-update';
import {
  MASTERCODE_MAINTENANCE_LISTING,
  MASTERCODE_MAINTENANCE_UPDATE_FILTER,
  MASTERCODE_MAINTENANCE_FILTER_LISTING,
  MASTERCODE_MAINTENANCE_CREATE,
  MASTERCODE_MAINTENANCE_UPDATE,
  MASTERCODE_MAINTENANCE_DELETE,
  MASTERCODE_MAINTENANCE_EDIT,
  MASTERCODE_MAINTENANCE_CANCEL_EDITING,
  MASTERCODE_MAINTENANCE_ADD,
  MASTERCODE_MAINTENANCE_REMOVE_ADD,
  MASTERCODE_MAINTENANCE_SET_VALUE,
  MASTERCODE_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'mastCode',
        label: 'Master Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'mastCode',
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
    case MASTERCODE_MAINTENANCE_CREATE.PENDING:
    case MASTERCODE_MAINTENANCE_UPDATE.PENDING:
    case MASTERCODE_MAINTENANCE_DELETE.PENDING:
    case MASTERCODE_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case MASTERCODE_MAINTENANCE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: [...payload] },
          filteredList: { $set: [...payload] },
        },
      });
    case MASTERCODE_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex(item => item.id === payload);
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

    case MASTERCODE_MAINTENANCE_UPDATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex(item => item.id === payload);
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
    case MASTERCODE_MAINTENANCE_CREATE.ERROR:
    case MASTERCODE_MAINTENANCE_UPDATE.ERROR:
    case MASTERCODE_MAINTENANCE_DELETE.ERROR:
    case MASTERCODE_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case MASTERCODE_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case MASTERCODE_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_EDIT: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex(item => item.id === payload);
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
    case MASTERCODE_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_SET_VALUE: {
      const { name, value, id } = payload;
      const index = state.data.editingList.findIndex(item => item.id === id);
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
    case MASTERCODE_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

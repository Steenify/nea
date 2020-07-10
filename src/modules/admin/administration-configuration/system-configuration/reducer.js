import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  SYSCONFIG_MAINTENANCE_LISTING,
  SYSCONFIG_MAINTENANCE_UPDATE_FILTER,
  SYSCONFIG_MAINTENANCE_FILTER_LISTING,
  SYSCONFIG_MAINTENANCE_CREATE,
  SYSCONFIG_MAINTENANCE_UPDATE,
  SYSCONFIG_MAINTENANCE_DELETE,
  SYSCONFIG_MAINTENANCE_EDIT,
  SYSCONFIG_MAINTENANCE_CANCEL_EDITING,
  SYSCONFIG_MAINTENANCE_ADD,
  SYSCONFIG_MAINTENANCE_REMOVE_ADD,
  SYSCONFIG_MAINTENANCE_SET_VALUE,
  SYSCONFIG_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'configName',
        label: 'Configuration Name',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'configName',
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
    case SYSCONFIG_MAINTENANCE_CREATE.PENDING:
    case SYSCONFIG_MAINTENANCE_UPDATE.PENDING:
    case SYSCONFIG_MAINTENANCE_DELETE.PENDING:
    case SYSCONFIG_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case SYSCONFIG_MAINTENANCE_LISTING.SUCCESS:
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
    case SYSCONFIG_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case SYSCONFIG_MAINTENANCE_CREATE.SUCCESS: {
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
              updateable: { $set: payload.updateable },
            },
          },
        };
      }
      return update(state, newState);
    }

    case SYSCONFIG_MAINTENANCE_UPDATE.SUCCESS: {
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
    case SYSCONFIG_MAINTENANCE_CREATE.ERROR:
    case SYSCONFIG_MAINTENANCE_UPDATE.ERROR:
    case SYSCONFIG_MAINTENANCE_DELETE.ERROR:
    case SYSCONFIG_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case SYSCONFIG_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case SYSCONFIG_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case SYSCONFIG_MAINTENANCE_EDIT: {
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
    case SYSCONFIG_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case SYSCONFIG_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case SYSCONFIG_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case SYSCONFIG_MAINTENANCE_SET_VALUE: {
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
    case SYSCONFIG_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

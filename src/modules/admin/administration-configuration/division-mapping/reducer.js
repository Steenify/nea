import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  DIVISION_MAINTENANCE_LISTING,
  DIVISION_MAINTENANCE_UPDATE_FILTER,
  DIVISION_MAINTENANCE_FILTER_LISTING,
  DIVISION_MAINTENANCE_CREATE,
  DIVISION_MAINTENANCE_UPDATE,
  DIVISION_MAINTENANCE_DELETE,
  DIVISION_MAINTENANCE_EDIT,
  DIVISION_MAINTENANCE_CANCEL_EDITING,
  DIVISION_MAINTENANCE_ADD,
  DIVISION_MAINTENANCE_REMOVE_ADD,
  DIVISION_MAINTENANCE_SET_VALUE,
  DIVISION_MAINTENANCE_RESET_REDUCER,
  DIVISION_MAINTENANCE_ROLE_LISTING,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'divCode',
        sortType: 'number',
        label: 'Division Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'divCode',
    },
  },
  data: {
    list: [],
    editingList: [],
    filteredList: [],
    userRoles: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case DIVISION_MAINTENANCE_CREATE.PENDING:
    case DIVISION_MAINTENANCE_UPDATE.PENDING:
    case DIVISION_MAINTENANCE_DELETE.PENDING:
    case DIVISION_MAINTENANCE_LISTING.PENDING:
    case DIVISION_MAINTENANCE_ROLE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case DIVISION_MAINTENANCE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: _.unionBy(state.data.editingList, payload, 'divId') },
          filteredList: { $set: _.unionBy(state.data.filteredList, payload, 'divId') },
        },
      });
    case DIVISION_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.divId !== payload) },
        },
      });
    }
    case DIVISION_MAINTENANCE_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.divId === payload.oldId);
      const newState = {
        ui: {
          isLoading: { $set: false },
        },
      };
      if (index > -1) {
        newState.data = {
          // editingList: { $splice: [[index, 1]] },
          editingList: {
            [index]: {
              divId: { $set: payload.newId },
              action: { $set: undefined },
            },
          },
        };
      }
      return update(state, newState);
    }

    case DIVISION_MAINTENANCE_UPDATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.divId === payload);
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
    case DIVISION_MAINTENANCE_ROLE_LISTING.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          userRoles: { $set: [...payload] },
        },
      });
    }
    case DIVISION_MAINTENANCE_ROLE_LISTING.ERROR:
    case DIVISION_MAINTENANCE_CREATE.ERROR:
    case DIVISION_MAINTENANCE_UPDATE.ERROR:
    case DIVISION_MAINTENANCE_DELETE.ERROR:
    case DIVISION_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case DIVISION_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case DIVISION_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case DIVISION_MAINTENANCE_EDIT: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.divId === payload);
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
    case DIVISION_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case DIVISION_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case DIVISION_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.divId !== payload) },
        },
      });
    }
    case DIVISION_MAINTENANCE_SET_VALUE: {
      const { name, value, divId } = payload;
      const index = state.data.editingList.findIndex((item) => item.divId === divId);
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
    case DIVISION_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

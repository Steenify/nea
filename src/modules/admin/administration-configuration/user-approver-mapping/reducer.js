import update from 'react-addons-update';
import {
  USER_APPROVER_MAPPING_LISTING,
  USER_APPROVER_MAPPING_UPDATE_FILTER,
  USER_APPROVER_MAPPING_FILTER_LISTING,
  USER_APPROVER_MAPPING_DELETE,
  USER_APPROVER_MAPPING_EDIT,
  USER_APPROVER_MAPPING_CREATE,
  USER_APPROVER_MAPPING_UPDATE,
  USER_APPROVER_MAPPING_CANCEL_EDITING,
  USER_APPROVER_MAPPING_ADD,
  USER_APPROVER_MAPPING_REMOVE_ADD,
  USER_APPROVER_MAPPING_SET_VALUE,
  USER_APPROVER_MAPPING_RESET_REDUCER,
  USER_APPROVER_MAPPING_ROLE_LISTING,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'user',
        label: 'User',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'user',
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
    case USER_APPROVER_MAPPING_CREATE.PENDING:
    case USER_APPROVER_MAPPING_UPDATE.PENDING:
    case USER_APPROVER_MAPPING_DELETE.PENDING:
    case USER_APPROVER_MAPPING_ROLE_LISTING.PENDING:
    case USER_APPROVER_MAPPING_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case USER_APPROVER_MAPPING_ROLE_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          userRoles: { $set: [...payload] },
        },
      });
    case USER_APPROVER_MAPPING_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: [...payload] },
          filteredList: { $set: [...payload] },
          // editingList: { $set: _.unionBy(state.data.editingList, payload, 'id') },
          // filteredList: { $set: _.unionBy(state.data.filteredList, payload, 'id') },
        },
      });
    case USER_APPROVER_MAPPING_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case USER_APPROVER_MAPPING_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.id === payload.oldId);
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
              action: { $set: undefined },
              id: { $set: payload.newId },
            },
          },
        };
      }
      return update(state, newState);
    }

    case USER_APPROVER_MAPPING_UPDATE.SUCCESS: {
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
    case USER_APPROVER_MAPPING_CREATE.ERROR:
    case USER_APPROVER_MAPPING_UPDATE.ERROR:
    case USER_APPROVER_MAPPING_DELETE.ERROR:
    case USER_APPROVER_MAPPING_LISTING.ERROR:
    case USER_APPROVER_MAPPING_ROLE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case USER_APPROVER_MAPPING_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case USER_APPROVER_MAPPING_EDIT: {
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
    case USER_APPROVER_MAPPING_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case USER_APPROVER_MAPPING_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case USER_APPROVER_MAPPING_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case USER_APPROVER_MAPPING_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case USER_APPROVER_MAPPING_SET_VALUE: {
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
    case USER_APPROVER_MAPPING_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

import update from 'react-addons-update';
import {
  ROLE_FUNCTION_MAPPING_LISTING,
  ROLE_FUNCTION_MAPPING_UPDATE_FILTER,
  ROLE_FUNCTION_MAPPING_FILTER_LISTING,
  ROLE_FUNCTION_MAPPING_DELETE,
  ROLE_FUNCTION_MAPPING_EDIT,
  ROLE_FUNCTION_MAPPING_CANCEL_EDITING,
  ROLE_FUNCTION_MAPPING_REMOVE_ADD,
  ROLE_FUNCTION_MAPPING_SET_VALUE,
  ROLE_FUNCTION_MAPPING_RESET_REDUCER,
} from './action';

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
    editingList: [],
    filteredList: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ROLE_FUNCTION_MAPPING_DELETE.PENDING:
    case ROLE_FUNCTION_MAPPING_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case ROLE_FUNCTION_MAPPING_LISTING.SUCCESS:
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
    case ROLE_FUNCTION_MAPPING_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_DELETE.ERROR:
    case ROLE_FUNCTION_MAPPING_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case ROLE_FUNCTION_MAPPING_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case ROLE_FUNCTION_MAPPING_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_EDIT: {
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
    case ROLE_FUNCTION_MAPPING_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case ROLE_FUNCTION_MAPPING_SET_VALUE: {
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
    case ROLE_FUNCTION_MAPPING_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  PRODUCT_MAINTENANCE_LISTING,
  PRODUCT_MAINTENANCE_UPDATE_FILTER,
  PRODUCT_MAINTENANCE_FILTER_LISTING,
  PRODUCT_MAINTENANCE_DELETE,
  PRODUCT_MAINTENANCE_EDIT,
  PRODUCT_MAINTENANCE_CREATE,
  PRODUCT_MAINTENANCE_UPDATE,
  PRODUCT_MAINTENANCE_CANCEL_EDITING,
  PRODUCT_MAINTENANCE_ADD,
  PRODUCT_MAINTENANCE_REMOVE_ADD,
  PRODUCT_MAINTENANCE_SET_VALUE,
  PRODUCT_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'productName',
        label: 'Product Name',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'productName',
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
    case PRODUCT_MAINTENANCE_CREATE.PENDING:
    case PRODUCT_MAINTENANCE_UPDATE.PENDING:
    case PRODUCT_MAINTENANCE_DELETE.PENDING:
    case PRODUCT_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case PRODUCT_MAINTENANCE_LISTING.SUCCESS:
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
    case PRODUCT_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case PRODUCT_MAINTENANCE_CREATE.SUCCESS: {
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

    case PRODUCT_MAINTENANCE_UPDATE.SUCCESS: {
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
    case PRODUCT_MAINTENANCE_CREATE.ERROR:
    case PRODUCT_MAINTENANCE_UPDATE.ERROR:
    case PRODUCT_MAINTENANCE_DELETE.ERROR:
    case PRODUCT_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case PRODUCT_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case PRODUCT_MAINTENANCE_EDIT: {
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
    case PRODUCT_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case PRODUCT_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case PRODUCT_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case PRODUCT_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case PRODUCT_MAINTENANCE_SET_VALUE: {
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
    case PRODUCT_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

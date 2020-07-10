import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  LAPSE_CONFIGURATION_LISTING,
  LAPSE_CONFIGURATION_UPDATE_FILTER,
  LAPSE_CONFIGURATION_FILTER_LISTING,
  LAPSE_CONFIGURATION_CREATE,
  LAPSE_CONFIGURATION_UPDATE,
  LAPSE_CONFIGURATION_DELETE,
  LAPSE_CONFIGURATION_EDIT,
  LAPSE_CONFIGURATION_CANCEL_EDITING,
  LAPSE_CONFIGURATION_ADD,
  LAPSE_CONFIGURATION_REMOVE_ADD,
  LAPSE_CONFIGURATION_SET_VALUE,
  LAPSE_CONFIGURATION_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'lapseCode',
        label: 'Lapse Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'lapseCode',
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
    case LAPSE_CONFIGURATION_CREATE.PENDING:
    case LAPSE_CONFIGURATION_UPDATE.PENDING:
    case LAPSE_CONFIGURATION_DELETE.PENDING:
    case LAPSE_CONFIGURATION_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case LAPSE_CONFIGURATION_LISTING.SUCCESS:
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
    case LAPSE_CONFIGURATION_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case LAPSE_CONFIGURATION_CREATE.SUCCESS: {
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
              id: { $set: payload.newId },
              action: { $set: undefined },
            },
          },
        };
      }
      return update(state, newState);
    }

    case LAPSE_CONFIGURATION_UPDATE.SUCCESS: {
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
    case LAPSE_CONFIGURATION_CREATE.ERROR:
    case LAPSE_CONFIGURATION_UPDATE.ERROR:
    case LAPSE_CONFIGURATION_DELETE.ERROR:
    case LAPSE_CONFIGURATION_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case LAPSE_CONFIGURATION_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case LAPSE_CONFIGURATION_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case LAPSE_CONFIGURATION_EDIT: {
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
    case LAPSE_CONFIGURATION_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case LAPSE_CONFIGURATION_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case LAPSE_CONFIGURATION_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case LAPSE_CONFIGURATION_SET_VALUE: {
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
    case LAPSE_CONFIGURATION_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

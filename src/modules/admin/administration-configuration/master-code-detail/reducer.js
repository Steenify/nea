import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  MASTERCODE_MAINTENANCE_DETAIL_LISTING,
  MASTERCODE_MAINTENANCE_DETAIL_UPDATE_FILTER,
  MASTERCODE_MAINTENANCE_DETAIL_FILTER_LISTING,
  MASTERCODE_MAINTENANCE_DETAIL_CREATE,
  MASTERCODE_MAINTENANCE_DETAIL_UPDATE,
  MASTERCODE_MAINTENANCE_DETAIL_DELETE,
  MASTERCODE_MAINTENANCE_DETAIL_EDIT,
  MASTERCODE_MAINTENANCE_DETAIL_CANCEL_EDITING,
  MASTERCODE_MAINTENANCE_DETAIL_ADD,
  MASTERCODE_MAINTENANCE_DETAIL_REMOVE_ADD,
  MASTERCODE_MAINTENANCE_DETAIL_SET_VALUE,
  MASTERCODE_MAINTENANCE_DETAIL_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'code',
        label: 'Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'code',
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
    case MASTERCODE_MAINTENANCE_DETAIL_CREATE.PENDING:
    case MASTERCODE_MAINTENANCE_DETAIL_UPDATE.PENDING:
    case MASTERCODE_MAINTENANCE_DETAIL_DELETE.PENDING:
    case MASTERCODE_MAINTENANCE_DETAIL_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case MASTERCODE_MAINTENANCE_DETAIL_LISTING.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          list: { $set: [...payload] },
          editingList: { $set: _.unionBy(state.data.editingList, payload, 'codeId') },
          filteredList: { $set: _.unionBy(state.data.filteredList, payload, 'codeId') },
        },
      });
    case MASTERCODE_MAINTENANCE_DETAIL_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.codeId !== payload) },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_DETAIL_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.codeId === payload.oldId);
      const newState = {
        ui: {
          isLoading: { $set: false },
        },
      };
      if (index > -1) {
        newState.data = {
          editingList: {
            [index]: {
              codeId: { $set: payload.newId },
              action: { $set: undefined },
            },
          },
        };
      }
      return update(state, newState);
    }

    case MASTERCODE_MAINTENANCE_DETAIL_UPDATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.codeId === payload);
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
    case MASTERCODE_MAINTENANCE_DETAIL_CREATE.ERROR:
    case MASTERCODE_MAINTENANCE_DETAIL_UPDATE.ERROR:
    case MASTERCODE_MAINTENANCE_DETAIL_DELETE.ERROR:
    case MASTERCODE_MAINTENANCE_DETAIL_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case MASTERCODE_MAINTENANCE_DETAIL_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case MASTERCODE_MAINTENANCE_DETAIL_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_DETAIL_EDIT: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.codeId === payload);
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
    case MASTERCODE_MAINTENANCE_DETAIL_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_DETAIL_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_DETAIL_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.codeId !== payload) },
        },
      });
    }
    case MASTERCODE_MAINTENANCE_DETAIL_SET_VALUE: {
      const { name, value, codeId } = payload;
      const index = state.data.editingList.findIndex((item) => item.codeId === codeId);
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
    case MASTERCODE_MAINTENANCE_DETAIL_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

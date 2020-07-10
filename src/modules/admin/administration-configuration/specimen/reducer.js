import update from 'react-addons-update';
import * as _ from 'lodash';
import {
  SPECIMEN_MAINTENANCE_LISTING,
  SPECIMEN_MAINTENANCE_UPDATE_FILTER,
  SPECIMEN_MAINTENANCE_FILTER_LISTING,
  SPECIMEN_MAINTENANCE_CREATE,
  SPECIMEN_MAINTENANCE_UPDATE,
  SPECIMEN_MAINTENANCE_DELETE,
  SPECIMEN_MAINTENANCE_EDIT,
  SPECIMEN_MAINTENANCE_CANCEL_EDITING,
  SPECIMEN_MAINTENANCE_ADD,
  SPECIMEN_MAINTENANCE_REMOVE_ADD,
  SPECIMEN_MAINTENANCE_SET_VALUE,
  SPECIMEN_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'specimenTypeCd',
        label: 'Specimen Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'specimenTypeCd',
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
    case SPECIMEN_MAINTENANCE_CREATE.PENDING:
    case SPECIMEN_MAINTENANCE_UPDATE.PENDING:
    case SPECIMEN_MAINTENANCE_DELETE.PENDING:
    case SPECIMEN_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case SPECIMEN_MAINTENANCE_LISTING.SUCCESS:
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
    case SPECIMEN_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case SPECIMEN_MAINTENANCE_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex((item) => item.id === payload);
      const newState = {
        ui: {
          isLoading: { $set: false },
        },
      };
      if (index > -1) {
        newState.data = {
          editingList: { $splice: [[index, 1]] },
          // editingList: {
          //   [index]: {
          //     action: {
          //       $set: undefined,
          //     },
          //   },
          // },
        };
      }
      return update(state, newState);
    }

    case SPECIMEN_MAINTENANCE_UPDATE.SUCCESS: {
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
    case SPECIMEN_MAINTENANCE_CREATE.ERROR:
    case SPECIMEN_MAINTENANCE_UPDATE.ERROR:
    case SPECIMEN_MAINTENANCE_DELETE.ERROR:
    case SPECIMEN_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case SPECIMEN_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case SPECIMEN_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case SPECIMEN_MAINTENANCE_EDIT: {
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
    case SPECIMEN_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case SPECIMEN_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case SPECIMEN_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter((item) => item.id !== payload) },
        },
      });
    }
    case SPECIMEN_MAINTENANCE_SET_VALUE: {
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
    case SPECIMEN_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

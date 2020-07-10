import update from 'react-addons-update';
import {
  SPECIES_CODE_MAINTENANCE_LISTING,
  SPECIES_CODE_MAINTENANCE_UPDATE_FILTER,
  SPECIES_CODE_MAINTENANCE_FILTER_LISTING,
  SPECIES_CODE_MAINTENANCE_CREATE,
  SPECIES_CODE_MAINTENANCE_UPDATE,
  SPECIES_CODE_MAINTENANCE_DELETE,
  SPECIES_CODE_MAINTENANCE_EDIT,
  SPECIES_CODE_MAINTENANCE_CANCEL_EDITING,
  SPECIES_CODE_MAINTENANCE_ADD,
  SPECIES_CODE_MAINTENANCE_REMOVE_ADD,
  SPECIES_CODE_MAINTENANCE_SET_VALUE,
  SPECIES_CODE_MAINTENANCE_RESET_REDUCER,
} from './action';

export const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
    filterValue: {
      sortValue: {
        id: 'speciesCode',
        label: 'Species Code',
        desc: false,
      },
      filterValue: null,
      datePickerValue: null,
      searchText: '',
      searchType: 'speciesCode',
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
    case SPECIES_CODE_MAINTENANCE_CREATE.PENDING:
    case SPECIES_CODE_MAINTENANCE_UPDATE.PENDING:
    case SPECIES_CODE_MAINTENANCE_DELETE.PENDING:
    case SPECIES_CODE_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case SPECIES_CODE_MAINTENANCE_LISTING.SUCCESS:
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
    case SPECIES_CODE_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case SPECIES_CODE_MAINTENANCE_CREATE.SUCCESS: {
      const temp = [...state.data.editingList];
      const index = temp.findIndex(item => item.id === payload.oldId);
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

    case SPECIES_CODE_MAINTENANCE_UPDATE.SUCCESS: {
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
    case SPECIES_CODE_MAINTENANCE_CREATE.ERROR:
    case SPECIES_CODE_MAINTENANCE_UPDATE.ERROR:
    case SPECIES_CODE_MAINTENANCE_DELETE.ERROR:
    case SPECIES_CODE_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case SPECIES_CODE_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });

    case SPECIES_CODE_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case SPECIES_CODE_MAINTENANCE_EDIT: {
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
    case SPECIES_CODE_MAINTENANCE_UPDATE_FILTER: {
      return update(state, {
        ui: {
          filterValue: { $set: { ...state.ui.filterValue, ...payload } },
        },
      });
    }
    case SPECIES_CODE_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case SPECIES_CODE_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case SPECIES_CODE_MAINTENANCE_SET_VALUE: {
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
    case SPECIES_CODE_MAINTENANCE_RESET_REDUCER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;

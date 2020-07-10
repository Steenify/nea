import update from 'react-addons-update';
import {
  NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING,
  NOTIFICATION_TEMPLATE_MAINTENANCE_FILTER_LISTING,
  NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE,
  NOTIFICATION_TEMPLATE_MAINTENANCE_EDIT,
  NOTIFICATION_TEMPLATE_MAINTENANCE_CANCEL_EDITING,
  NOTIFICATION_TEMPLATE_MAINTENANCE_ADD,
  NOTIFICATION_TEMPLATE_MAINTENANCE_REMOVE_ADD,
  NOTIFICATION_TEMPLATE_MAINTENANCE_SET_VALUE,
} from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
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
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.PENDING:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.SUCCESS:
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
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DELETE.ERROR:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_LISTING.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case NOTIFICATION_TEMPLATE_MAINTENANCE_FILTER_LISTING:
      return update(state, {
        data: {
          filteredList: { $set: payload },
        },
      });
    case NOTIFICATION_TEMPLATE_MAINTENANCE_EDIT: {
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
    case NOTIFICATION_TEMPLATE_MAINTENANCE_CANCEL_EDITING: {
      const temp = [...state.data.list];
      return update(state, {
        data: {
          editingList: { $set: temp },
        },
      });
    }
    case NOTIFICATION_TEMPLATE_MAINTENANCE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [payload, ...state.data.editingList] },
        },
      });
    }
    case NOTIFICATION_TEMPLATE_MAINTENANCE_REMOVE_ADD: {
      return update(state, {
        data: {
          editingList: { $set: [...state.data.editingList].filter(item => item.id !== payload) },
        },
      });
    }
    case NOTIFICATION_TEMPLATE_MAINTENANCE_SET_VALUE: {
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
    default:
      return state;
  }
};

export default reducer;

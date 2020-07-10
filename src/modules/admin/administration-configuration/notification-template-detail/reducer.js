import update from 'react-addons-update';
import { NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE, NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE, GET_SYS_CONFIG, NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
    fileConfigs: null,
    notificationNameLOV: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_SYS_CONFIG.PENDING:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.PENDING:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.PENDING:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case GET_SYS_CONFIG.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
        data: {
          fileConfigs: { $set: payload },
        },
      });
    }
    case NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.SUCCESS:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          notificationNameLOV: { $set: payload },
        },
      });
    }
    case GET_SYS_CONFIG.ERROR:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.ERROR:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.ERROR:
    case NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.ERROR:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    default:
      return state;
  }
};

export default reducer;

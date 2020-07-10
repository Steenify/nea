import update from 'react-addons-update';
import { BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE, BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES } from './action';

const initialState = {
  ui: {
    isLoading: false,
    errorMessage: null,
  },
  data: {
    detail: null,
    publishUserGroupLOV: [],
  },
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.PENDING:
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.PENDING:
      return update(state, {
        ui: {
          isLoading: { $set: true },
        },
      });
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.SUCCESS:
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
      });
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.SUCCESS: {
      return update(state, {
        ui: {
          isLoading: { $set: false },
        },
        data: {
          publishUserGroupLOV: { $set: payload },
        },
      });
    }
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.ERROR:
    case BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.ERROR:
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

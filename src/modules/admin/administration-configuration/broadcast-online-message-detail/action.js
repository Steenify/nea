import moment from 'moment';

import { broadcastMessageOnlineCreateService, broadcastMessageOnlineUpdateService } from 'services/administration-configuration/broadcast-online-message';
import { roleListingService } from 'services/authentication-authorisation/role-function-mapping';
import { actionCreator, actionTryCatchCreator, dateStringFromDate } from 'utils';

export const defaultAddValue = () => ({
  broadcastTitle: '',
  broadcastMessageContent: '',
  startDate: dateStringFromDate(moment()),
  startTime: '00:00:00',
  endDate: dateStringFromDate(moment()),
  endTime: '23:59:59',
  publishUserGroup: [],
  urgency: '',
  remark: '',
});

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE = actionCreator('BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(broadcastMessageOnlineCreateService(params), onPending, onSuccess, onError);
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_UPDATE = actionCreator('BROADCAST_ONLINE_MESSAGE_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_UPDATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(broadcastMessageOnlineUpdateService(params), onPending, onSuccess, onError);
};

export const BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES = actionCreator('BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES');
export const getRolesAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.PENDING,
    });
  };
  const onSuccess = (data) => {
    const lov = (data?.roleVoList).map((role) => ({
      label: role.roleName,
      value: role.roleName,
    }));
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.SUCCESS,
      payload: lov,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BROADCAST_ONLINE_MESSAGE_MAINTENANCE_GET_ROLES.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(roleListingService(params), onPending, onSuccess, onError);
};

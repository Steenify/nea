import moment from 'moment';

import { notificationTemplateCreateService, notificationTemplateUpdateService, notificationTemplateDropdownService } from 'services/administration-configuration/notification-template';
import { getSysConfigurations } from 'services/file-operation';
import { SUBMISSION_TYPE } from 'constants/index';
import { actionCreator, actionTryCatchCreator, dateStringFromDate } from 'utils';

export const defaultAddValue = () => ({
  notificationType: '',
  notificationName: '',
  effDate: dateStringFromDate(moment()),
  effTime: '00:00:00',
  expDate: dateStringFromDate(moment()),
  expTime: '23:59:59',
  attachment: [],
  emailSubject: '',
  emailContent: [],
  remarks: '',
});

export const GET_SYS_CONFIG = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_GET_SYS_CONFIG');
export const getSysConfigAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_SYS_CONFIG.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_SYS_CONFIG.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_SYS_CONFIG.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getSysConfigurations({ configName: SUBMISSION_TYPE.NOTIFICATION_TEMPLATE }), onPending, onSuccess, onError);
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(notificationTemplateCreateService(params), onPending, onSuccess, onError);
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(notificationTemplateUpdateService(params), onPending, onSuccess, onError);
};

export const NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN = actionCreator('NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN');
export const getDropdownAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data?.notiVoList || [];
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.SUCCESS,
      payload: list,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: NOTIFICATION_TEMPLATE_MAINTENANCE_DROPDOWN.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(notificationTemplateDropdownService(params), onPending, onSuccess, onError);
};

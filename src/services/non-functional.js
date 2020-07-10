import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  NON_FUNCTIONAL: {
    IN_APP_NOTIFICATION: { LIST, VIEW, UPDATE, DOWNLOAD },
    AMOUNT_EMAIL_SENT,
    SEARCH_USER,
    USER_ROLE_LOV,
    APPLICATION_STATUS,
    GET_BROADCAST_ONLINE_MESSAGE,
    SHOW_COMMON_UPLOAD,
    COMMON_UPLOAD,
  },
  DASHBOARD: { AMOUNT_NOTIFICATION_SENT },
} = API_URLS;

export const viewApplicationStatusService = (data) =>
  request({
    isBatchServer: true,
    data,
    ...APPLICATION_STATUS,
  });

export const showCommonUploadService = (data) =>
  request({
    data,
    ...SHOW_COMMON_UPLOAD,
  });

export const commonUploadService = (params, body) =>
  request({
    data: body,
    params,
    ...COMMON_UPLOAD,
  });

export const broadcastOnlineMessageService = (data) =>
  request({
    data,
    ...GET_BROADCAST_ONLINE_MESSAGE,
  });

export const getAmtOfNotificationSentService = (data) =>
  request({
    data,
    ...AMOUNT_NOTIFICATION_SENT,
  });

export const getAmountEmailSentService = (data) =>
  request({
    data,
    ...AMOUNT_EMAIL_SENT,
  });

export const inAppNotificationListService = (data) =>
  request({
    data,
    ...LIST,
  });

export const inAppNotificationViewService = (data) =>
  request({
    data,
    ...VIEW,
  });

export const inAppNotificationUpdateService = (data) =>
  request({
    data,
    ...UPDATE,
  });

export const inAppNotificationDownloadService = (data) =>
  request({
    data,
    ...DOWNLOAD,
  });

export const searchUserService = (data) =>
  request({
    data,
    ...SEARCH_USER,
  });

export const getUserRolesLovService = (data) =>
  request({
    data,
    ...USER_ROLE_LOV,
  });

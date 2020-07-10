/* eslint-disable import/prefer-default-export */
import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  DASHBOARD: { EMAIL_HISTORY_DETAIL, NOTIFICATION_HISTORY_DETAILS },
} = API_URLS;

export const getEmailHistoryDetails = (data = {}) =>
  request({
    data,
    ...EMAIL_HISTORY_DETAIL,
  });

export const getInAppNotificationListDetailsService = (data = {}) =>
  request({
    data,
    ...NOTIFICATION_HISTORY_DETAILS,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  AUDIT_TRAILS_REPORTS: {
    USER_AUDIT_LOG: { RETREIVE, DOWNLOAD },
  },
} = API_URLS;

export const retrieveUserAuditLogService = data =>
  request({
    data,
    ...RETREIVE,
  });

export const downloadUserAuditLogService = data =>
  request({
    data,
    ...DOWNLOAD,
  });

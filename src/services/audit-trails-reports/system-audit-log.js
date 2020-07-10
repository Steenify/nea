import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  AUDIT_TRAILS_REPORTS: {
    SYSTEM_AUDIT_LOG: { RETREIVE, DOWNLOAD },
  },
} = API_URLS;

export const retrieveSystemAuditLogService = data =>
  request({
    data,
    ...RETREIVE,
  });

export const downloadSystemAuditLogService = data =>
  request({
    data,
    ...DOWNLOAD,
  });

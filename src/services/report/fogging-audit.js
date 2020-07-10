import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    FOGGING_AUDIT: { NOTIFICATION_AND_AUDIT_RESULTS },
  },
} = API_URLS;

export const generateNotificationAndAuditResultsReportService = (data) =>
  request({
    data,
    ...NOTIFICATION_AND_AUDIT_RESULTS,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  EHI_GRAVITRAP_AUDIT: { QUERY_LAPSE_OBSERVED, QUERY_TASK_AUDITED },
} = API_URLS;

export const queryTaskAuditedService = data => request({ ...QUERY_TASK_AUDITED, data });

export const queryLapseObservedService = data => request({ ...QUERY_LAPSE_OBSERVED, data });

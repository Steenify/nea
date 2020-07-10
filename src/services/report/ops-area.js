import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    OPS_AREA: { OPERATION_REPORT },
  },
} = API_URLS;

export const generateOperationReportService = (data) =>
  request({
    data,
    ...OPERATION_REPORT,
  });

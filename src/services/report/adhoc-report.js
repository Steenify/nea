import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    ADHOC_REPORT: { GET_TABLE_LISTING, QUERY_ADHOC_REPORT },
  },
} = API_URLS;

export const getTableListingService = (data) =>
  request({
    data,
    ...GET_TABLE_LISTING,
  });

export const queryAdhocReportService = (data) =>
  request({
    data,
    ...QUERY_ADHOC_REPORT,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    RODENT_AUDIT: { ZONE_TRACKING, COMPANY_NAMES_LISTING, GENERATE_SHOW_CAUSE_REPORT },
  },
} = API_URLS;

export const zoneTrackingService = (data) =>
  request({
    data,
    ...ZONE_TRACKING,
  });

export const companyNamesListingService = () =>
  request({
    ...COMPANY_NAMES_LISTING,
  });

export const generateShowCauseReportService = (data) =>
  request({
    data,
    ...GENERATE_SHOW_CAUSE_REPORT,
  });

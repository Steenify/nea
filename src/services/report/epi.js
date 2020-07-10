import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    EPI: { CLUSTER_SUMMARY_REPORT, EPI_FINDING_REPORT, CLUSTER_UNDER_SURVEILANCE_REPORT, DENGUE_WEBSITE_FILE_FOR_ACTIVE_CASES, DENGUE_WEBSITE_FILE_UNDER_SURVEILANCE },
  },
} = API_URLS;

export const generateEPIFindingsService = (data) =>
  request({
    data,
    ...EPI_FINDING_REPORT,
  });

export const generateEPIClusterSummaryService = (data) =>
  request({
    data,
    ...CLUSTER_SUMMARY_REPORT,
  });

export const generateEPIClusterUnderSurveillanceService = (data) =>
  request({
    data,
    ...CLUSTER_UNDER_SURVEILANCE_REPORT,
  });

export const generateEPIFileActiveCasesService = (data) =>
  request({
    data,
    ...DENGUE_WEBSITE_FILE_FOR_ACTIVE_CASES,
  });

export const generateEPIFileUnderSurveillanceService = (data) =>
  request({
    data,
    ...DENGUE_WEBSITE_FILE_UNDER_SURVEILANCE,
  });

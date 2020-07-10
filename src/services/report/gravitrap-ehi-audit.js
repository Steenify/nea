import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    GRAVITRAP_EHI_AUDIT: { COMPARE_CONTRACTOR_EHI, EHI_AUDIT_SHOW_CAUSE_REPORT, MOSQUITO_ID_REPORT, SUMMARY_OF_MOSQUITO_IN_CLUSTER },
  },
} = API_URLS;

export const generateCompareContractorEHIService = (data) =>
  request({
    data,
    ...COMPARE_CONTRACTOR_EHI,
  });

export const generateEHIAuditShowCauseService = (data) =>
  request({
    data,
    ...EHI_AUDIT_SHOW_CAUSE_REPORT,
  });

export const generateMosquitoIdService = (data) =>
  request({
    data,
    ...MOSQUITO_ID_REPORT,
  });

export const generateMosquitoSpeciesService = (data) =>
  request({
    data,
    ...SUMMARY_OF_MOSQUITO_IN_CLUSTER,
  });

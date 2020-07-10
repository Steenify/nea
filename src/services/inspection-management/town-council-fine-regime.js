import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    TC_FINE_REGIME: { LISTING, DETAIL, SUMMARY, CONFIRM_SUMMARY, SAVE_DETAIL, UPLOAD, REJECT, SUPPORT, APPROVE, APPROVED_TC_FORM_3_LIST, SUBMIT_TO_EEMS2, QUERY },
  },
} = API_URLS;

export const getAllTownCouncilFineRegimeListingService = (data = {}) =>
  request({
    data,
    ...QUERY,
  });

export const getTownCouncilFineRegimeListingService = (data = {}) =>
  request({
    data,
    ...LISTING,
  });

export const getTownCouncilFineRegimeDetailService = (data = {}) =>
  request({
    data,
    ...DETAIL,
  });

export const saveTownCouncilFineRegimeDetailService = (data = {}) =>
  request({
    data,
    ...SAVE_DETAIL,
  });

export const getTownCouncilFineRegimeSummaryService = (data = {}) =>
  request({
    data,
    ...SUMMARY,
  });

export const confirmTownCouncilFineRegimeSummaryService = (data = {}) =>
  request({
    data,
    ...CONFIRM_SUMMARY,
  });

export const uploadTownCouncilFineRegimePCOService = (data = {}) =>
  request({
    data,
    ...UPLOAD,
  });

export const rejectTownCouncilFineRegimeService = (data = {}) =>
  request({
    data,
    ...REJECT,
  });

export const approveTownCouncilFineRegimeService = (data = {}) =>
  request({
    data,
    ...APPROVE,
  });

export const supportTownCouncilFineRegimeService = (data = {}) =>
  request({
    data,
    ...SUPPORT,
  });

export const getApprovedTcForm3ListService = (data = {}) =>
  request({
    data,
    ...APPROVED_TC_FORM_3_LIST,
  });

export const sendToEEMSService = (data = {}) =>
  request({
    data,
    ...SUBMIT_TO_EEMS2,
  });

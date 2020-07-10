import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    LATEST_BLOCK_SUMMARY: { APPROVE_INSPECTION_NOTICE, REJECT_INSPECTION_NOTICE, APPROVING_INSPECTION_NOTICE },
  },
} = API_URLS;

export const approveInspectionNoticeService = (data = {}) =>
  request({
    data,
    ...APPROVE_INSPECTION_NOTICE,
  });

export const rejectInspectionNoticeService = (data = {}) =>
  request({
    data,
    ...REJECT_INSPECTION_NOTICE,
  });

export const getApprovingInspectionNoticeService = (data) =>
  request({
    data,
    ...APPROVING_INSPECTION_NOTICE,
  });

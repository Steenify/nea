import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  COMMON: { APPROVAL_LISTING },
} = API_URLS;

export const getApprovalListingService = (data = {}) =>
  request({
    data,
    ...APPROVAL_LISTING,
  });

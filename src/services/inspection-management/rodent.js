import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    RODENT: { LISTING, DETAIL },
  },
} = API_URLS;

export const getRodentInspectionListingService = (data = {}) =>
  request({
    data,
    ...LISTING,
  });

export const getRodentInspectionDetailService = (data = {}) =>
  request({
    data,
    ...DETAIL,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    MONITORING_OF_INSPECTION_RESULTS: { LISTING, DETAIL },
  },
} = API_URLS;

export const getGroundSurveillanceDetailService = (data = { rccId: '16003' }) =>
  request({
    data,
    ...DETAIL,
  });

export const getGroundSurveillanceListingService = (data = {}) =>
  request({
    data,
    ...LISTING,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    MASTER_CODE: { SEARCH, DELETE_DETAIL, UPDATE_DETAIL, CREATE_DETAIL },
    // ADDRESS: { VIEW },
  },
} = API_URLS;

export const masterCodeListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const masterCodeDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE_DETAIL,
  });

export const masterCodeCreateService = (data = {}) =>
  request({
    data,
    ...CREATE_DETAIL,
  });

export const masterCodeUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE_DETAIL,
  });

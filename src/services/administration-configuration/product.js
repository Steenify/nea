import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    PRODUCT: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const productListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const productDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const productUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

export const productCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

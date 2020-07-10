import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    DIVISION: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const divisionListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const divisionDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const divisionCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const divisionUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

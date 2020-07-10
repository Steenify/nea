import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    SPECIES_CODE: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const speciesCodeListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const speciesCodeDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const speciesCodeCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const speciesCodeUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

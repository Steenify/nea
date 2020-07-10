import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    SPECIMEN: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const specimenListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const specimenDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const specimenCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const specimenUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

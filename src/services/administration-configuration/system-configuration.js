import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    SYSTEM_CONFIGURATION: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const sysConfigListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const sysConfigDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const sysConfigCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const sysConfigUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

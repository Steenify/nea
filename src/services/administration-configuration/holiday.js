import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    HOLIDAY: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const holidayListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const holidayDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const holidayCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const holidayUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

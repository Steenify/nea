import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    LAPSE_CONFIGURATION: { SEARCH, DELETE, SAVE },
  },
} = API_URLS;

export const lapseConfigListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const lapseConfigDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const lapseConfigCreateService = (data = {}) =>
  request({
    data,
    ...SAVE,
  });

export const lapseConfigUpdateService = (data = {}) =>
  request({
    data,
    ...SAVE,
  });

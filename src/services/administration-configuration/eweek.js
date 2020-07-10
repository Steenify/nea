import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    EWEEK: { GENERATE, CONFIRM, PREVIOUS_YEAR, SEARCH },
  },
} = API_URLS;

export const searchEWeekService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const generateEWeekService = (data = {}) =>
  request({
    data,
    ...GENERATE,
  });

export const confirmEWeekService = (data = {}) =>
  request({
    data,
    ...CONFIRM,
  });

export const getPreviousYearService = (data = {}) =>
  request({
    data,
    ...PREVIOUS_YEAR,
  });

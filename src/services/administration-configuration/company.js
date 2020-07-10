import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    COMPANY: { CREATE },
  },
} = API_URLS;

export const companyCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

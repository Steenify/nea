import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    ADDRESS: { VIEW },
  },
} = API_URLS;

export const retrieveAddressService = (data = { postalCode: '' }) =>
  request({
    data,
    ...VIEW,
  });

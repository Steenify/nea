import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  EHI_GRAVITRAP_AUDIT: {
    USER_LOGGED_TASK: { LISTING, UPDATE },
  },
} = API_URLS;

export const listingService = () => request({ ...LISTING });

export const updateService = (data = { gtUserLoggedTasksList: [] }) => request({ data, ...UPDATE });

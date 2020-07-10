import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    BROADCAST_MESSAGE_ONLINE: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const broadcastMessageOnlineListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const broadcastMessageOnlineDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const broadcastMessageOnlineUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

export const broadcastMessageOnlineCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    NOTIFICATION_TEMPLATE: { SEARCH, DELETE, UPDATE, CREATE, DROPDOWN },
  },
} = API_URLS;

export const notificationTemplateListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const notificationTemplateDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const notificationTemplateUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

export const notificationTemplateCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

export const notificationTemplateDropdownService = (data = {}) =>
  request({
    data,
    ...DROPDOWN,
  });

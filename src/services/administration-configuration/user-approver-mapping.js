import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  ADMINISTRATION: {
    USER_APPROVER_MAPPING: { SEARCH, DELETE, UPDATE, CREATE },
  },
} = API_URLS;

export const userApproverMappingListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const userApproverMappingDeleteService = (data = {}) =>
  request({
    data,
    ...DELETE,
  });

export const userApproverMappingUpdateService = (data = {}) =>
  request({
    data,
    ...UPDATE,
  });

export const userApproverMappingCreateService = (data = {}) =>
  request({
    data,
    ...CREATE,
  });

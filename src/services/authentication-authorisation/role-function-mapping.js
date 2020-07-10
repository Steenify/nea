import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  AUTHENTICATION: {
    ROLE_FUNCTION_MAPPING: { SEARCH, NON_ASSIGNED_FUNCTIONS, ASSIGNED_FUNCTIONS, SUBMIT },
  },
} = API_URLS;

export const roleListingService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const nonAssignedFunctionsService = (data = {}) =>
  request({
    data,
    ...NON_ASSIGNED_FUNCTIONS,
  });

export const assignedFunctionsService = (data = {}) =>
  request({
    data,
    ...ASSIGNED_FUNCTIONS,
  });

export const deleteRoleService = (data = {}) =>
  request({
    data,
    ...SEARCH,
  });

export const submitRoleFunctionService = (data = {}) =>
  request({
    data,
    ...SUBMIT,
  });

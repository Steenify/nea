import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  OPS_AREA: {
    ALL_ACTIVE_OPERATIONS,
    ACTIVE_OPERATIONS_SG,
    SEARCH_ACTIVE_OPERATIONS,
    ACTIVE_OPERATIONS_FOR_USER,
    LINK_TO_EXISTING_OPS,
    CLOSE_OPERATION,
    SEARCH_ADDRESS_BY_POSTAL_CODE,
    CREATE_OPS_ADHOC,
    ADDRESS_LIST_IN_OPS,
    UPDATE_ADHOC_OPS,
    OPS_DATA_TABLE,
    FIND_OFFICER,
    REASSIGN_OPERATION,
    ADDITIONAL_INFO_SUMMARY,
    ADDITIONAL_INFO_UPDATE,
  },
} = API_URLS;

export const searchActiveOperationsService = (data = {}) =>
  request({
    data,
    ...SEARCH_ACTIVE_OPERATIONS,
  });

export const activeOperationsForUserService = (data = {}) =>
  request({
    data,
    ...ACTIVE_OPERATIONS_FOR_USER,
  });

export const getActiveOpsSGService = (data = {}) =>
  request({
    data,
    ...ACTIVE_OPERATIONS_SG,
  });

export const allActiveOperationsService = (data = {}) =>
  request({
    data,
    ...ALL_ACTIVE_OPERATIONS,
  });

export const createAdHocOperationService = (data = {}) =>
  request({
    data,
    ...CREATE_OPS_ADHOC,
  });

export const updateAdHocOpsService = (data = {}) =>
  request({
    data,
    ...UPDATE_ADHOC_OPS,
  });

export const linkToExistingOperationService = (data = {}) =>
  request({
    data,
    ...LINK_TO_EXISTING_OPS,
  });

export const closeOperationService = (data = {}) =>
  request({
    data,
    ...CLOSE_OPERATION,
  });

export const getAddressListInOpsService = (data = {}) =>
  request({
    data,
    ...ADDRESS_LIST_IN_OPS,
  });

export const searchAddressByPostalCodeService = (data = {}) =>
  request({
    data,
    ...SEARCH_ADDRESS_BY_POSTAL_CODE,
  });

export const getOpsDataTableService = (data = {}) =>
  request({
    data,
    ...OPS_DATA_TABLE,
  });

export const findOfficerOpsService = (data = {}) =>
  request({
    data,
    ...FIND_OFFICER,
  });

export const reassignOpsService = (data = {}) =>
  request({
    data,
    ...REASSIGN_OPERATION,
  });

export const getAdditionalInfoService = (data = {}) =>
  request({
    data,
    ...ADDITIONAL_INFO_SUMMARY,
  });

export const updateAdditionalInfoService = (data = {}) =>
  request({
    data,
    ...ADDITIONAL_INFO_UPDATE,
  });

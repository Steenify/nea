import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  EPI_INVESTIGATION: {
    CASE: { LISTING, CLAIM, DETAIL, REASSIGN_LISTING, REASSIGN, CLAIM_LISTING, BULK_FINDING_LISTING, DOWNLOAD_BULK_FINDING, WORK_SPACE_LISTING, UPLOAD, SUBMIT, GET_LIST_CDC },
  },
} = API_URLS;

export const caseListService = (data = {}) =>
  request({
    data,
    ...LISTING,
  });

export const caseClaimService = (data = { caseIdList: [] }) =>
  request({
    data,
    ...CLAIM,
  });

export const caseClaimListService = (data = {}) =>
  request({
    data,
    ...CLAIM_LISTING,
  });

export const caseDetailService = (data) =>
  request({
    data,
    ...DETAIL,
  });

export const caseReassignListService = (data = {}) =>
  request({
    data,
    ...REASSIGN_LISTING,
  });

export const caseReassignService = (data = {}) =>
  request({
    data,
    ...REASSIGN,
  });

export const getBulkFindingService = (data = {}) =>
  request({
    data,
    ...BULK_FINDING_LISTING,
  });
export const downloadBulkFindingService = (data = {}) =>
  request({
    data,
    ...DOWNLOAD_BULK_FINDING,
  });

export const getWorkSpaceListingService = () =>
  request({
    ...WORK_SPACE_LISTING,
  });

export const caseUploadService = (data = {}) =>
  request({
    data,
    ...UPLOAD,
  });

export const caseSubmitService = (data = {}) =>
  request({
    data,
    ...SUBMIT,
  });

export const cdcListingService = (data = {}) =>
  request({
    data,
    ...GET_LIST_CDC,
  });

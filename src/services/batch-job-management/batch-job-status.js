import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  BATCH_JOB_MANAGEMENT: {
    BATCH_JOB_STATUS,
    BATCH_JOB_STATUS_DETAIL_LISTING,
    BATCH_JOB_STATUS_SEARCH,
    BATCH_JOB_STATUS_CREATE,
    BATCH_JOB_STATUS_UPDATE,
    BATCH_JOB_STATUS_DELETE,
    BATCH_JOB_STATUS_TRIGGER,
    BATCH_JOB_STATUS_TERMINATE,
    SEARCH_END_POINT_URL,
  },
} = API_URLS;

export const searchJobEndPtService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...SEARCH_END_POINT_URL,
  });

export const viewBatchJobStatusDetailListingService = (data) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_DETAIL_LISTING,
  });

export const viewBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS,
  });

export const searchBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_SEARCH,
  });

export const createBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_CREATE,
  });

export const updateBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_UPDATE,
  });

export const deleteBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_DELETE,
  });

export const terminateBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_TERMINATE,
  });

export const triggerBatchJobStatusService = (data = {}) =>
  request({
    isBatchServer: true,
    data,
    ...BATCH_JOB_STATUS_TRIGGER,
  });

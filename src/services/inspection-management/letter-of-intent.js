import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    LOI: { LAST_12_MONTHS_LIST, CREATE, SAVE, DOWNLOAD, PREVIEW, APPROVAL, SUBMITTED_APPROVE },
  },
} = API_URLS;

export const loiLast12MonthsLOIListService = (data) =>
  request({
    data,
    ...LAST_12_MONTHS_LIST,
  });

export const loiCreateService = (data) =>
  request({
    data,
    ...CREATE,
  });

export const loiSaveService = (data) =>
  request({
    data,
    ...SAVE,
  });

export const loiDownloadService = (data) =>
  request({
    data,
    ...DOWNLOAD,
  });

export const loiPreviewService = (data) =>
  request({
    data,
    ...PREVIEW,
  });

export const loiSubmitForApprovalService = (data) =>
  request({
    data,
    ...APPROVAL,
  });

export const loiApproveSubmittedListingService = (data) =>
  request({
    data,
    ...SUBMITTED_APPROVE,
  });

import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    SOF: { LISTING, DETAIL, SAVE, SUBMIT, DOWNLOAD },
  },
} = API_URLS;

export const sofListingService = () =>
  request({
    ...LISTING,
  });

export const sofDetailService = data =>
  request({
    data,
    ...DETAIL,
  });

export const sofSaveService = data =>
  request({
    data,
    ...SAVE,
  });

export const sofSubmitService = data =>
  request({
    data,
    ...SUBMIT,
  });

export const sofDownloadService = data =>
  request({
    data,
    ...DOWNLOAD,
  });

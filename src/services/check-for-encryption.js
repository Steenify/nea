import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  CHECK_FOR_ENCRYPTION: { REPORT, UPLOAD },
} = API_URLS;

export const checkReportEncryptionService = (data) =>
  request({
    data,
    ...REPORT,
  });

export const checkUploadEncryptionService = (data) =>
  request({
    data,
    ...UPLOAD,
  });

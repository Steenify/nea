import { request, CancelToken } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  FILE_OPERATION_API: { UPLOAD, DELETE, DOWNLOAD, GET_CONFIGS, UPLOADED_FILES, DOWNLOAD_UPLOADED_ERROR_FILES },
} = API_URLS;

const cachedFiles = [];

// const isCached = fileId => {
//   return cachedFiles.findIndex(file => file.fileId === fileId);
// };

export const uploadFile = (
  data = {
    file: {},
    fileStatus: 'string',
    submissionType: 'string',
    submissionId: 'string',
  },
) =>
  request({
    ...UPLOAD,
    data,
  });

export const downloadFile = (data = { fileId: '' }) => {
  // const cachedFile = cachedFiles.find(file => file.fileId === data.fileId);
  // if (cachedFile) {
  //   return cachedFile;
  // }
  // const source = CancelToken.source();
  const result = {
    fileId: data.fileId,
    request: request({
      ...DOWNLOAD,
      data,
      // cancelToken: source.token,
    }),
    // cancel: source.cancel,
  };
  cachedFiles.push(result);
  return result;
};

export const deleteFile = (
  data = {
    fileId: '',
  },
) =>
  request({
    data,
    ...DELETE,
    // url: `${FILE_OPERATION_API.DELETE.url}/${data.fileId}`,
  });

export const getSysConfigurations = (
  data = {
    submissionType: '',
    submissionId: '',
  },
) =>
  request({
    ...GET_CONFIGS,
    data,
  });

export const getUploadedFilesService = (data) =>
  request({
    data,
    ...UPLOADED_FILES,
  });

export const downloadUploadedErrorFilesService = (data = { fileId: '' }) => {
  // const cachedFile = cachedFiles.find((file) => file.fileId === data.fileId);
  // if (cachedFile) {
  //   return cachedFile;
  // }
  const source = CancelToken.source();
  const result = {
    fileId: data.fileId,
    request: request({
      ...DOWNLOAD_UPLOADED_ERROR_FILES,
      data,
      cancelToken: source.token,
    }),
    cancel: source.cancel,
  };
  // cachedFiles.push(result);
  return result;
};

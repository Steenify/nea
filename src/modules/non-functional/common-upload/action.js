import { actionCreator, actionTryCatchCreator } from 'utils';
import { showCommonUploadService, commonUploadService } from 'services/non-functional';

export const RESET_COMMON_UPLOAD = 'RESET_COMMON_UPLOAD';
export const resetCommonUploadAction = (_callback) => (dispatch) => {
  dispatch({
    type: RESET_COMMON_UPLOAD,
  });
};

export const SHOW_COMMON_UPLOAD = actionCreator('SHOW_COMMON_UPLOAD');
export const showCommonUploadAction = (callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SHOW_COMMON_UPLOAD.PENDING,
    });
  };
  const onSuccess = (data) => {
    let list = data.map((item) => item.mastCdVo?.mastCdDetList || []);
    if (list.length > 0) {
      list = list.reduce((total, current) => total.concat(current)).map((item) => ({ label: item.codeDesc, value: item.code }));
    }
    dispatch({
      type: SHOW_COMMON_UPLOAD.SUCCESS,
      payload: list,
    });
    if (callback) callback(list);
  };
  const onError = (error) => {
    dispatch({
      type: SHOW_COMMON_UPLOAD.ERROR,
      payload: error,
    });
    // if (errorCallback) errorCallback(error);
  };
  await actionTryCatchCreator(showCommonUploadService(), onPending, onSuccess, onError);
};

export const COMMON_UPLOAD = actionCreator('COMMON_UPLOAD');
export const commonUploadAction = (params, body, callback, errorCallback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: COMMON_UPLOAD.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: COMMON_UPLOAD.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: COMMON_UPLOAD.ERROR,
      payload: error,
    });
    if (errorCallback) errorCallback(error);
  };
  await actionTryCatchCreator(commonUploadService(params, body), onPending, onSuccess, onError);
};

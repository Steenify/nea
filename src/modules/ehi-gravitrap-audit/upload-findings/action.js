import { uploadFindingsService } from 'services/site-paper-gravitrap-audit/index';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const CASE_UPLOAD = actionCreator('EHI_CASE_UPLOAD');
export const caseUploadAction = (data = {}, callback, onErrorHandler) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CASE_UPLOAD.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: CASE_UPLOAD.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: CASE_UPLOAD.ERROR,
      payload: error,
    });
    if (onErrorHandler) onErrorHandler(error);
  };
  await actionTryCatchCreator(uploadFindingsService(data), onPending, onSuccess, onError);
};

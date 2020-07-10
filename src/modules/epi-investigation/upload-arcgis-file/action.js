import { caseUploadService } from 'services/epi-investigation/case';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const CASE_UPLOAD = actionCreator('EPI_CASE_UPLOAD');
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
  await actionTryCatchCreator(caseUploadService(data), onPending, onSuccess, onError);
};
